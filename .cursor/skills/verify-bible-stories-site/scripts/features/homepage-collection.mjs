import { screenshot, withBrowser, writeAria, writeNotes } from "../browser.mjs";

export async function driveHomepageCollection({ baseUrl, evidenceDir, doctor }) {
  return withBrowser(baseUrl, async ({ page }) => {
    await page.goto("/");
    await page.getByRole("heading", { name: /Bible Stories/i }).first().waitFor();
    await page.locator("#books").waitFor();
    await page.getByRole("heading", { name: "Our Storybook Collection" }).waitFor();
    await screenshot(page, evidenceDir, "01-home-collection.png");

    await page.getByRole("button", { name: "Trust", exact: true }).click();
    await page.locator("#books article").filter({ hasText: "Trust" }).first().waitFor();
    await screenshot(page, evidenceDir, "02-theme-trust.png");

    await page.getByRole("link", { name: "Series Map", exact: true }).click();
    await page.locator("#series-map").waitFor();
    await page.getByRole("heading", { name: "Series Map" }).waitFor();
    await screenshot(page, evidenceDir, "03-series-map.png");
    await writeAria(page, evidenceDir, "#books");

    writeNotes(evidenceDir, {
      feature: "homepage-collection",
      entryPoint: "/",
      baseUrl,
      doctorOk: doctor.ok,
    });
  });
}
