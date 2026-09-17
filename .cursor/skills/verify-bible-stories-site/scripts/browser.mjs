import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

export async function withBrowser(baseUrl, fn, options = {}) {
  const browser = await chromium.launch({
    headless: options.headless !== false,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    baseURL: baseUrl,
    permissions: options.permissions || [],
  });
  const page = await context.newPage();
  try {
    return await fn({ browser, context, page, baseUrl });
  } finally {
    await context.close();
    await browser.close();
  }
}

export async function screenshot(page, dir, name) {
  const path = join(dir, name);
  await page.screenshot({ path, fullPage: false });
  return path;
}

export async function writeAria(page, dir, selector = "body") {
  const locator = page.locator(selector).first();
  let text = "";
  if (typeof locator.ariaSnapshot === "function") {
    text = await locator.ariaSnapshot();
  } else {
    const snap = await page.accessibility.snapshot();
    text = JSON.stringify(snap, null, 2);
  }
  const path = join(dir, "aria.txt");
  writeFileSync(path, `${text}\n`);
  return path;
}

export async function writeNotes(dir, fields) {
  const lines = Object.entries(fields).map(([key, value]) => `- **${key}:** ${value}`);
  writeFileSync(join(dir, "notes.md"), `# Verification notes\n\n${lines.join("\n")}\n`);
}
