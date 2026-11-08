import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const extensions = [".ts", ".tsx", ".js", ".mjs", ".json"];

function resolveFile(base) {
  if (existsSync(base) && statSync(base).isFile()) return base;
  for (const extension of extensions) {
    const candidate = base + extension;
    if (existsSync(candidate)) return candidate;
  }
  return base;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const file = resolveFile(path.join(root, specifier.slice(2)));
    return nextResolve(pathToFileURL(file).href, context);
  }
  return nextResolve(specifier, context);
}
