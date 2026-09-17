import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { fetchJson, writeJson } from "../lib.mjs";
import { screenshot, withBrowser, writeAria, writeNotes } from "../browser.mjs";

export async function driveTonight({ baseUrl, evidenceDir, doctor }) {
  const catalog = await fetchJson(`${baseUrl}/api/ask-angel-books`);
  writeJson(join(evidenceDir, "ask-angel-books.json"), catalog.json);

  return withBrowser(baseUrl, async ({ page }) => {
    await page.goto("/");
    await page.getByRole("heading", { name: /Bible Stories/i }).first().waitFor();
    await screenshot(page, evidenceDir, "01-home-before-tonight.png");

    await page.getByRole("link", { name: "Tonight", exact: true }).click();
    await page.waitForURL("**/tonight");
    await page.getByRole("heading", { name: "Tonight's story", exact: true }).waitFor();

    const featured = page.locator("h2").filter({ hasNotText: "Share tonight" }).first();
    await featured.waitFor({ state: "visible" });
    const nightlyTitle = (await featured.innerText()).trim();
    if (!nightlyTitle) {
      throw new Error("Tonight hydrated without a featured book title");
    }

    const catalogTitles = (catalog.json?.books || []).map((book) => book.title);
    if (!catalogTitles.includes(nightlyTitle)) {
      throw new Error(`Tonight title "${nightlyTitle}" is not in /api/ask-angel-books`);
    }

    await page.getByText(/Tonight -/).first().waitFor();
    await screenshot(page, evidenceDir, "02-tonight-featured.png");

    await page.getByRole("button", { name: "Read a few pages", exact: true }).click();
    const peek = page.locator("#peek");
    await peek.waitFor({ state: "visible" });
    await peek.getByText(/A bedtime peek · 1 of/).waitFor();
    await screenshot(page, evidenceDir, "03-peek-page-1.png");

    await page.getByRole("button", { name: "Next page →", exact: true }).click();
    await peek.getByText(/A bedtime peek · 2 of/).waitFor();
    await screenshot(page, evidenceDir, "04-peek-page-2.png");
    await writeAria(page, evidenceDir, "#peek");

    const localDate = await page.evaluate(() => new Date().toDateString());
    writeNotes(evidenceDir, {
      feature: "tonight",
      entryPoint: "nav link Tonight from /",
      baseUrl,
      nightlyTitle,
      localDate,
      doctorOk: doctor.ok,
    });
    writeFileSync(
      join(evidenceDir, "result.txt"),
      `tonight ok: ${nightlyTitle} peek advanced to page 2\n`,
    );

    return { nightlyTitle };
  });
}
