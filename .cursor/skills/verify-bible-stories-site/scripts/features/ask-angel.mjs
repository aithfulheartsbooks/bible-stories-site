import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { fetchJson, writeJson } from "../lib.mjs";
import { screenshot, withBrowser, writeAria, writeNotes } from "../browser.mjs";

export async function driveAskAngel({ baseUrl, evidenceDir, doctor }) {
  const catalog = await fetchJson(`${baseUrl}/api/ask-angel-books`);
  writeJson(join(evidenceDir, "ask-angel-books.json"), catalog.json);
  if (!catalog.json?.count) {
    throw new Error("ask-angel-books returned no books");
  }

  return withBrowser(baseUrl, async ({ page }) => {
    const workerStatuses = [];
    page.on("response", (response) => {
      if (response.url().includes("ask-angel.ruhezhao.workers.dev")) {
        workerStatuses.push(response.status());
      }
    });

    await page.goto("/");
    await screenshot(page, evidenceDir, "01-home-fab.png");

    await page.getByRole("button", { name: "Ask Angel - Find your book" }).click();
    const panel = page.locator("#ask-angel-panel");
    await page.waitForFunction(() =>
      document.getElementById("ask-angel-panel")?.classList.contains("open"),
    );
    await panel.getByText("I am Angel", { exact: false }).waitFor();
    await screenshot(page, evidenceDir, "02-angel-open.png");

    await page.locator("#angel-input").fill("how many books");
    await page.getByRole("button", { name: "Send" }).click();
    await page.locator(".angel-msg-row.user .angel-bubble").filter({ hasText: "how many books" }).waitFor();
    await page.locator(".angel-msg-row:not(.user) .angel-bubble").nth(1).waitFor({ timeout: 20_000 });
    await screenshot(page, evidenceDir, "03-angel-reply.png");
    await writeAria(page, evidenceDir, "#ask-angel-panel");

    const replyText = (await page.locator(".angel-bubble.bot").last().innerText()).trim();
    if (!replyText) {
      throw new Error("Ask Angel produced an empty bot bubble");
    }

    await page.getByRole("button", { name: "Close" }).click();
    await page.waitForFunction(
      () => !document.getElementById("ask-angel-panel")?.classList.contains("open"),
    );

    writeNotes(evidenceDir, {
      feature: "ask-angel",
      entryPoint: "FAB on /",
      baseUrl,
      catalogCount: catalog.json.count,
      workerStatuses: workerStatuses.join(",") || "none",
      replyExcerpt: replyText.slice(0, 180),
      doctorOk: doctor.ok,
    });
    writeFileSync(join(evidenceDir, "result.txt"), `ask-angel ok: ${replyText.slice(0, 120)}\n`);
  });
}
