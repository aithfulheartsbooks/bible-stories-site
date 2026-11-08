import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";
import { tonightPrintables, seriesBadges } from "../lib/tonight-catalog.ts";

const base = process.env.TONIGHT_BASE_URL ?? "http://127.0.0.1:3456";
const artifacts = process.env.TONIGHT_ARTIFACTS ?? "/opt/cursor/artifacts";
const storageKey = "tonight-reading-badges.v1";
const chrome = process.env.CHROME_PATH ?? "/usr/bin/google-chrome";

fs.mkdirSync(artifacts, { recursive: true });

const results = [];

function check(name, ok, detail) {
  results.push({ name, ok, detail });
  if (!ok) console.error(`FAIL ${name}: ${detail}`);
  else console.log(`PASS ${name}`);
}

async function slugs(page) {
  return page.locator("[data-tonight-slug]").evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("data-tonight-slug")),
  );
}

async function waitForStory(page) {
  await page.waitForSelector("[data-tonight-slug]");
  const found = await slugs(page);
  if (found.length < 3 || new Set(found).size !== 1) {
    throw new Error(`story, printable, and badges diverged: ${found.join(",")}`);
  }
  return found[0];
}

function pdfPageCount(file) {
  const data = fs.readFileSync(file);
  const matches = data.toString("latin1").match(/\/Type\s*\/Page(?![s])/g);
  return matches ? matches.length : 0;
}

async function launch() {
  return chromium.launch({
    executablePath: chrome,
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
}

const browser = await launch();
const consoleErrors = [];

try {
  const mobile = {
    viewport: { width: 390, height: 844 },
    timezoneId: "America/Los_Angeles",
    deviceScaleFactor: 2,
  };

  const winter = await browser.newContext(mobile);
  await winter.clock.install({ time: new Date("2026-01-15T07:30:00Z") });
  const winterPage = await winter.newPage();
  winterPage.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  winterPage.on("pageerror", (error) => consoleErrors.push(String(error)));
  await winterPage.goto(`${base}/tonight`, { waitUntil: "networkidle" });
  const beforeMidnight = await waitForStory(winterPage);
  const amazon = winterPage.getByRole("link", { name: "Find on Amazon" });
  const download = winterPage.getByRole("link", { name: "Download coloring page" });
  const amazonBox = await amazon.boundingBox();
  const downloadBox = await download.boundingBox();
  check(
    "amazon stays above the printable",
    Boolean(amazonBox && downloadBox && amazonBox.y < downloadBox.y),
    `amazon y ${amazonBox?.y} download y ${downloadBox?.y}`,
  );
  check(
    "download href matches the registry",
    (await download.getAttribute("href")) === tonightPrintables[beforeMidnight].href,
    await download.getAttribute("href"),
  );
  await winterPage.screenshot({
    path: path.join(artifacts, "tonight-mobile-story.png"),
    fullPage: true,
  });
  await winterPage.clock.fastForward(30 * 60 * 1000);
  await winterPage.waitForFunction(
    (previous) =>
      document.querySelector("[data-tonight-slug]")?.getAttribute("data-tonight-slug") !== previous,
    beforeMidnight,
  );
  const afterMidnight = await waitForStory(winterPage);
  const amazonAfter = await winterPage.getByRole("link", { name: "Find on Amazon" }).first().getAttribute("href");
  check(
    "standard-time open tab rolls at local midnight",
    beforeMidnight !== afterMidnight && Boolean(amazonAfter?.includes("amazon.com")),
    `${beforeMidnight} -> ${afterMidnight} amazon ${amazonAfter}`,
  );
  check(
    "share block remains after midnight",
    (await winterPage.getByRole("heading", { name: "Share tonight's story" }).count()) === 1,
    "share heading missing",
  );

  await winterPage.clock.setFixedTime(new Date("2026-01-15T08:00:00Z"));
  const held = await waitForStory(winterPage);
  await winterPage.clock.setFixedTime(new Date("2026-01-16T08:05:00Z"));
  await winterPage.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
  await winterPage.waitForFunction(
    (previous) =>
      document.querySelector("[data-tonight-slug]")?.getAttribute("data-tonight-slug") !== previous,
    held,
  );
  check(
    "resumed tab follows the same clock",
    (await waitForStory(winterPage)) !== held,
    `${held} -> ${await waitForStory(winterPage)}`,
  );
  await winter.close();

  const summer = await browser.newContext(mobile);
  await summer.clock.install({ time: new Date("2026-07-15T06:30:00Z") });
  const summerPage = await summer.newPage();
  await summerPage.goto(`${base}/tonight`, { waitUntil: "networkidle" });
  const summerEvening = await waitForStory(summerPage);
  await summerPage.clock.fastForward(30 * 60 * 1000);
  await summerPage.waitForFunction(
    (previous) =>
      document.querySelector("[data-tonight-slug]")?.getAttribute("data-tonight-slug") !== previous,
    summerEvening,
  );
  const summerMidnight = await waitForStory(summerPage);
  check(
    "daylight midnight changes the book",
    summerEvening !== summerMidnight,
    `${summerEvening} -> ${summerMidnight}`,
  );
  await summerPage.clock.fastForward(30 * 60 * 1000);
  await summerPage.waitForTimeout(300);
  check(
    "1:00 local stays on the midnight book",
    (await waitForStory(summerPage)) === summerMidnight,
    await waitForStory(summerPage),
  );
  await summer.close();

  const spring = await browser.newContext(mobile);
  await spring.clock.install({ time: new Date("2026-03-08T07:30:00Z") });
  const springPage = await spring.newPage();
  await springPage.goto(`${base}/tonight`, { waitUntil: "networkidle" });
  const beforeSpring = await waitForStory(springPage);
  await springPage.clock.setFixedTime(new Date("2026-03-08T08:30:00Z"));
  await springPage.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
  await springPage.waitForFunction(
    (previous) =>
      document.querySelector("[data-tonight-slug]")?.getAttribute("data-tonight-slug") !== previous,
    beforeSpring,
  );
  const springResumed = await waitForStory(springPage);
  check(
    "resume on the spring-forward night keeps story printable and badge together",
    springResumed !== beforeSpring,
    `${beforeSpring} -> ${springResumed}`,
  );
  await spring.close();

  const springOpen = await browser.newContext(mobile);
  await springOpen.clock.install({ time: new Date("2026-03-08T07:30:00Z") });
  const springOpenPage = await springOpen.newPage();
  await springOpenPage.goto(`${base}/tonight`, { waitUntil: "networkidle" });
  const springHeld = await waitForStory(springOpenPage);
  await springOpenPage.clock.fastForward(30 * 60 * 1000);
  await springOpenPage.waitForFunction(
    (previous) =>
      document.querySelector("[data-tonight-slug]")?.getAttribute("data-tonight-slug") !== previous,
    springHeld,
  );
  const shortDay = await waitForStory(springOpenPage);
  await springOpenPage.clock.fastForward(22 * 60 * 60 * 1000);
  await springOpenPage.waitForTimeout(300);
  check(
    "open tab stays on the 23-hour spring-forward day",
    (await waitForStory(springOpenPage)) === shortDay && shortDay !== springHeld,
    `${springHeld} -> ${shortDay} -> ${await waitForStory(springOpenPage)}`,
  );
  await springOpenPage.clock.fastForward(60 * 60 * 1000);
  await springOpenPage.waitForFunction(
    (previous) =>
      document.querySelector("[data-tonight-slug]")?.getAttribute("data-tonight-slug") !== previous,
    shortDay,
  );
  check(
    "next local midnight after spring-forward changes all three",
    (await waitForStory(springOpenPage)) !== shortDay,
    `${shortDay} -> ${await waitForStory(springOpenPage)}`,
  );
  await springOpen.close();

  const fall = await browser.newContext(mobile);
  await fall.clock.install({ time: new Date("2026-11-01T06:30:00Z") });
  const fallPage = await fall.newPage();
  await fallPage.goto(`${base}/tonight`, { waitUntil: "networkidle" });
  const beforeFall = await waitForStory(fallPage);
  await fallPage.clock.fastForward(30 * 60 * 1000);
  await fallPage.waitForFunction(
    (previous) =>
      document.querySelector("[data-tonight-slug]")?.getAttribute("data-tonight-slug") !== previous,
    beforeFall,
  );
  const longDay = await waitForStory(fallPage);
  await fallPage.clock.fastForward(24 * 60 * 60 * 1000);
  await fallPage.waitForTimeout(300);
  check(
    "open tab stays on the 25-hour fall-back day",
    (await waitForStory(fallPage)) === longDay && longDay !== beforeFall,
    `${beforeFall} -> ${longDay} -> ${await waitForStory(fallPage)}`,
  );
  await fallPage.clock.fastForward(60 * 60 * 1000);
  await fallPage.waitForFunction(
    (previous) =>
      document.querySelector("[data-tonight-slug]")?.getAttribute("data-tonight-slug") !== previous,
    longDay,
  );
  check(
    "next local midnight after fall-back changes all three",
    (await waitForStory(fallPage)) !== longDay,
    `${longDay} -> ${await waitForStory(fallPage)}`,
  );
  await fall.close();

  const collect = await browser.newContext(mobile);
  await collect.clock.install({ time: new Date("2026-01-15T07:30:00Z") });
  const collectPage = await collect.newPage();
  await collectPage.goto(`${base}/tonight`, { waitUntil: "networkidle" });
  const collectSlug = await waitForStory(collectPage);
  const collectButton = collectPage.getByRole("button", { name: "Collect this story" });
  await collectButton.click();
  const progress = collectPage.locator("#reading-badges-heading + p");
  await progress.getByText("1 of 36 collected").waitFor();
  await collectPage.getByRole("button", { name: "Collected" }).click();
  await collectPage.waitForTimeout(200);
  const countText = await progress.innerText();
  check("second collect stays at 1", countText.startsWith("1 of 36"), countText);
  await collectPage.reload({ waitUntil: "networkidle" });
  await collectPage.locator("#reading-badges-heading + p").getByText("1 of 36 collected").waitFor();
  await collectPage.close();
  const reopened = await collect.newPage();
  await reopened.goto(`${base}/tonight`, { waitUntil: "networkidle" });
  await reopened.locator("#reading-badges-heading + p").getByText("1 of 36 collected").waitFor();
  check("collection survives close and reopen", true, collectSlug);
  await reopened.getByRole("button", { name: /Show all 36 badges/ }).click();
  await reopened.screenshot({
    path: path.join(artifacts, "tonight-mobile-badges.png"),
    fullPage: true,
  });
  const other = await collect.newPage();
  await other.goto(`${base}/tonight`, { waitUntil: "networkidle" });
  await other.evaluate(
    ({ key, slug }) => {
      localStorage.setItem(key, JSON.stringify({ version: 1, slugs: [slug] }));
    },
    { key: storageKey, slug: "david-and-the-giant" },
  );
  await reopened.waitForFunction(
    () => document.querySelector("#reading-badges-heading + p")?.textContent?.includes("2 of 36"),
  );
  const stored = await reopened.evaluate((key) => localStorage.getItem(key), storageKey);
  check(
    "cross-tab write merges both slugs",
    stored.includes(collectSlug) && stored.includes("david-and-the-giant"),
    stored,
  );
  await collect.close();

  const fresh = await browser.newContext(mobile);
  await fresh.clock.install({ time: new Date("2026-01-15T07:30:00Z") });
  const freshPage = await fresh.newPage();
  await freshPage.goto(`${base}/tonight`, { waitUntil: "networkidle" });
  await freshPage.locator("#reading-badges-heading + p").getByText("0 of 36 collected").waitFor();
  check("a new browser context starts empty", true, "0 of 36");
  await fresh.close();

  const malformed = await browser.newContext(mobile);
  await malformed.addInitScript((key) => {
    localStorage.setItem(key, "{");
  }, storageKey);
  await malformed.clock.install({ time: new Date("2026-01-15T07:30:00Z") });
  const malformedPage = await malformed.newPage();
  await malformedPage.goto(`${base}/tonight`, { waitUntil: "networkidle" });
  await malformedPage.getByRole("status").getByText("couldn't be read").waitFor();
  await malformedPage.getByRole("button", { name: "Collect this story" }).click();
  const malformedRaw = await malformedPage.evaluate((key) => localStorage.getItem(key), storageKey);
  const malformedMessage = await malformedPage.locator("#reading-badges-heading + p").innerText();
  check(
    "malformed storage is kept and not called saved",
    malformedRaw === "{" && malformedMessage.includes("couldn't be read") && !malformedMessage.includes("1 of 36"),
    malformedMessage,
  );
  await malformed.close();

  const blocked = await browser.newContext(mobile);
  await blocked.addInitScript((key) => {
    const originalGet = Storage.prototype.getItem;
    const originalSet = Storage.prototype.setItem;
    Storage.prototype.getItem = function (name) {
      if (name === key) throw new Error("blocked");
      return originalGet.call(this, name);
    };
    Storage.prototype.setItem = function (name, value) {
      if (name === key) throw new Error("blocked");
      return originalSet.call(this, name, value);
    };
  }, storageKey);
  await blocked.clock.install({ time: new Date("2026-01-15T07:30:00Z") });
  const blockedPage = await blocked.newPage();
  await blockedPage.goto(`${base}/tonight`, { waitUntil: "networkidle" });
  await blockedPage.getByRole("status").getByText("couldn't open saved badges").waitFor();
  await blockedPage.getByRole("button", { name: "Collect this story" }).click();
  const blockedMessage = await blockedPage.locator("#reading-badges-heading + p").innerText();
  check(
    "throwing storage is not called saved",
    blockedMessage.includes("couldn't open saved badges") && !blockedMessage.includes("1 of 36"),
    blockedMessage,
  );
  await blocked.close();

  const quota = await browser.newContext(mobile);
  await quota.addInitScript((key) => {
    const originalSet = Storage.prototype.setItem;
    Storage.prototype.setItem = function (name, value) {
      if (name === key) throw new Error("quota");
      return originalSet.call(this, name, value);
    };
  }, storageKey);
  await quota.clock.install({ time: new Date("2026-01-15T07:30:00Z") });
  const quotaPage = await quota.newPage();
  await quotaPage.goto(`${base}/tonight`, { waitUntil: "networkidle" });
  await quotaPage.getByRole("button", { name: "Collect this story" }).click();
  await quotaPage.getByRole("status").getByText("didn't keep the badge").waitFor();
  const quotaLabel = await quotaPage.getByRole("button", { name: "Collect this story" }).count();
  check("failed write leaves the collect button uncollected", quotaLabel === 1, `buttons ${quotaLabel}`);
  await quota.close();

  const secureErrors = [];
  const secure = await browser.newContext(mobile);
  await secure.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new DOMException("The operation is insecure.", "SecurityError");
      },
    });
  });
  await secure.clock.install({ time: new Date("2026-01-15T07:30:00Z") });
  const securePage = await secure.newPage();
  securePage.on("pageerror", (error) => secureErrors.push(String(error)));
  await securePage.goto(`${base}/tonight`, { waitUntil: "networkidle" });
  await securePage.getByRole("heading", { name: "Jesus Calms the Storm" }).first().waitFor();
  await securePage.getByRole("link", { name: "Find on Amazon" }).waitFor();
  await securePage.getByRole("link", { name: "Download coloring page" }).waitFor();
  await securePage.getByRole("heading", { name: "Share tonight's story" }).waitFor();
  await securePage.getByRole("status").getByText("couldn't open saved badges").waitFor();
  await securePage.getByRole("button", { name: "Collect this story" }).click();
  const secureStatus = await securePage.locator("#reading-badges-heading + p").innerText();
  check(
    "localStorage getter throw leaves tonight usable",
    secureErrors.length === 0 &&
      secureStatus.includes("couldn't open saved badges") &&
      !secureStatus.includes("1 of 36") &&
      (await securePage.getByRole("button", { name: "Copy caption" }).count()) === 1,
    secureErrors.join(" | ") || secureStatus,
  );
  await secure.close();

  const mergeFail = await browser.newContext(mobile);
  await mergeFail.clock.install({ time: new Date("2026-01-15T07:30:00Z") });
  const keeper = await mergeFail.newPage();
  await keeper.goto(`${base}/tonight`, { waitUntil: "networkidle" });
  await waitForStory(keeper);
  await keeper.getByRole("button", { name: "Collect this story" }).click();
  await keeper.locator("#reading-badges-heading + p").getByText("Tonight is on the chart").waitFor();
  await keeper.evaluate((key) => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (name, value) {
      if (name === key) throw new Error("quota");
      return original.call(this, name, value);
    };
  }, storageKey);
  const writer = await mergeFail.newPage();
  await writer.goto(`${base}/tonight`, { waitUntil: "networkidle" });
  await writer.evaluate(
    ({ key, slug }) => {
      localStorage.setItem(key, JSON.stringify({ version: 1, slugs: [slug] }));
    },
    { key: storageKey, slug: "david-and-the-giant" },
  );
  await keeper.getByRole("status").getByText("didn't keep the badge").waitFor();
  const keeperStatus = await keeper.locator("#reading-badges-heading + p").innerText();
  check(
    "failed merge does not leave tonight collected",
    (await keeper.getByRole("button", { name: "Collect this story" }).count()) === 1 &&
      !keeperStatus.includes("Tonight is on the chart"),
    keeperStatus,
  );
  await mergeFail.close();

  const files = await browser.newContext();
  let served = 0;
  for (const badge of seriesBadges) {
    const printable = tonightPrintables[badge.slug];
    const response = await files.request.get(`${base}${printable.href}`);
    const body = await response.body();
    const ok = response.ok() && body.subarray(0, 5).toString() === "%PDF-";
    if (!ok) check(`served ${printable.href}`, false, String(response.status()));
    else served += 1;
  }
  check("all 36 coloring pages resolve from the app", served === 36, `${served} pdfs`);
  await files.close();

  const printContext = await browser.newContext({ ...mobile, timezoneId: "America/Los_Angeles" });
  await printContext.clock.install({ time: new Date("2026-01-15T07:30:00Z") });
  const printPage = await printContext.newPage();
  await printPage.goto(`${base}/tonight`, { waitUntil: "networkidle" });
  await waitForStory(printPage);
  await printPage.evaluate(() => {
    window.print = () => {
      window.__chartPrint = document.body.classList.contains("printing-tonight-chart");
    };
  });
  await printPage.getByRole("button", { name: "Print chart" }).click();
  check(
    "print button marks the chart for printing",
    await printPage.evaluate(() => window.__chartPrint === true),
    "class missing during print",
  );
  await printPage.evaluate(() => document.body.classList.add("printing-tonight-chart"));
  const pdfPath = path.join(artifacts, "tonight-badge-chart.pdf");
  await printPage.pdf({
    path: pdfPath,
    format: "Letter",
    printBackground: true,
    margin: { top: "0.4in", bottom: "0.4in", left: "0.4in", right: "0.4in" },
  });
  const pages = pdfPageCount(pdfPath);
  check("badge chart pdf is one page", pages === 1, `${pages} pages`);
  await printPage.screenshot({
    path: path.join(artifacts, "tonight-print-chart.png"),
    fullPage: true,
  });
  await printContext.close();

  const theme = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const themePage = await theme.newPage();
  await themePage.goto(`${base}/`, { waitUntil: "networkidle" });
  await themePage.screenshot({ path: path.join(artifacts, "theme-home-mobile.png") });
  await themePage.goto(`${base}/book/noah-and-gods-big-promise`, { waitUntil: "networkidle" });
  await themePage.screenshot({ path: path.join(artifacts, "theme-book-mobile.png") });
  const homeLeak = await themePage.goto(`${base}/`);
  check("homepage still responds", homeLeak?.ok() === true, String(homeLeak?.status()));
  const bookLeak = await theme.newPage();
  await bookLeak.goto(`${base}/book/noah-and-gods-big-promise`, { waitUntil: "networkidle" });
  check(
    "book page has no tonight collect button",
    (await bookLeak.getByRole("button", { name: "Collect this story" }).count()) === 0,
    "collect button leaked",
  );
  await theme.close();

  check(
    "no hydration console errors",
    consoleErrors.filter((line) => /hydrat/i.test(line)).length === 0,
    consoleErrors.filter((line) => /hydrat/i.test(line)).join(" | ") || "none",
  );
} finally {
  await browser.close();
}

const audit = seriesBadges.map((badge) => {
  const printable = tonightPrintables[badge.slug] ?? null;
  return {
    number: badge.number,
    slug: badge.slug,
    title: badge.title,
    coverImage: badge.coverImage,
    printable: printable
      ? {
          type: printable.type,
          description: printable.description,
          href: printable.href,
          previewSrc: printable.previewSrc,
        }
      : null,
  };
});
fs.writeFileSync(path.join(artifacts, "tonight-mapping-audit.json"), JSON.stringify(audit, null, 2));
fs.writeFileSync(path.join(artifacts, "tonight-verify-results.json"), JSON.stringify(results, null, 2));

const failed = results.filter((result) => !result.ok);
if (failed.length) {
  console.error(`${failed.length} checks failed`);
  process.exit(1);
}
console.log(`${results.length} checks passed`);
