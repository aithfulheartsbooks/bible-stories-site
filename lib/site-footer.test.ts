import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const footerPath = path.join(root, "components/SiteFooter.tsx");
const sharedClass =
  'className="relative z-10 px-6 pb-32 pt-12 text-center text-chestnut-soft sm:pb-16"';

function sourceFiles(dir: string): string[] {
  const found: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".git") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...sourceFiles(full));
      continue;
    }
    if (/\.(tsx|jsx|ts|js|mjs)$/.test(entry.name)) found.push(full);
  }
  return found;
}

test("the site has one footer component and it takes no variant props", () => {
  const footerFiles = sourceFiles(root).filter((file) => /footer/i.test(path.basename(file)) && file.endsWith(".tsx"));
  assert.deepEqual(
    footerFiles.map((file) => path.relative(root, file)),
    ["components/SiteFooter.tsx"],
  );

  const source = fs.readFileSync(footerPath, "utf8");
  assert.match(source, /export default function SiteFooter\(\)/);
  assert.doesNotMatch(source, /SiteFooter\(\s*\{/);
  assert.doesNotMatch(source, /\bextra\b/);
  assert.doesNotMatch(source, /ReactNode/);
  assert.equal(source.match(/<footer\b/g)?.length, 1);
  assert.match(source, new RegExp(sharedClass.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("every route uses the shared footer with no props, including /songs", () => {
  const files = [...sourceFiles(path.join(root, "app")), ...sourceFiles(path.join(root, "components"))];
  const songs = fs.readFileSync(path.join(root, "app/songs/page.tsx"), "utf8");
  const cards = fs.readFileSync(path.join(root, "app/songs/SongsClient.tsx"), "utf8");
  let uses = 0;

  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    const relative = path.relative(root, file);
    if (relative !== "components/SiteFooter.tsx") {
      assert.equal(source.includes("<footer"), false, `${relative} renders its own footer`);
    }
    for (const match of source.matchAll(/<SiteFooter\b([^>]*)>/g)) {
      uses += 1;
      assert.match(match[1], /^\s*\/$/, `${relative} forks SiteFooter: ${match[0]}`);
    }
  }

  assert.ok(uses >= 10, `expected the shared footer on the public pages, found ${uses}`);
  assert.match(songs, /<SiteFooter \/>/);
  assert.doesNotMatch(songs, /Tonight&apos;s story|Read the Zacchaeus story|Read all the Bible stories/);
  assert.match(songs, /song\.bookLink/);
  assert.match(cards, /song\.bookLink\.href/);
});
