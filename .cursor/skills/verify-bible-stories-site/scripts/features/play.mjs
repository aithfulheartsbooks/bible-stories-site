import { screenshot, withBrowser, writeAria, writeNotes } from "../browser.mjs";

export async function drivePlay({ baseUrl, evidenceDir, doctor }) {
  return withBrowser(baseUrl, async ({ page }) => {
    await page.goto("/play");
    await page.getByRole("heading", { name: "Play Corner" }).waitFor();
    await page.getByText("Today's three stories").waitFor();

    const dismiss = page.getByRole("button", { name: "Dismiss puzzle tutorial" });
    if (await dismiss.isVisible().catch(() => false)) {
      await dismiss.click();
    }

    await page.getByRole("button", { name: "Puzzle piece 1" }).waitFor({ timeout: 30_000 });
    if (await page.getByText("Today's picture could not load.").isVisible().catch(() => false)) {
      throw new Error("Play puzzle image failed to load");
    }
    await screenshot(page, evidenceDir, "01-play-board.png");

    const peek = page.getByRole("button", { name: "Peek", exact: true });
    await peek.hover();
    await peek.dispatchEvent("mousedown");
    await page.waitForTimeout(400);
    await screenshot(page, evidenceDir, "02-play-peek-hold.png");
    await peek.dispatchEvent("mouseup");

    await page.getByRole("button", { name: "Big Hearts" }).click();
    await page.getByRole("button", { name: "Puzzle piece 9" }).waitFor();
    await screenshot(page, evidenceDir, "03-play-big-hearts.png");
    await writeAria(page, evidenceDir, "main");

    writeNotes(evidenceDir, {
      feature: "play",
      entryPoint: "/play",
      baseUrl,
      doctorOk: doctor.ok,
      solved: false,
      note: "Board and peek proven. Album localStorage is only asserted after a real tile solve.",
    });
  });
}
