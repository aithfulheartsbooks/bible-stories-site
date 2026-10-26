import { screenshot, withBrowser, writeAria, writeNotes } from "../browser.mjs";

export async function driveBookPages({ baseUrl, evidenceDir, doctor }) {
  const slug = "noah-and-gods-big-promise";
  return withBrowser(baseUrl, async ({ page }) => {
    await page.goto(`/book/${slug}`);
    await page.getByRole("heading", { name: "Noah and God's Big Promise", exact: true }).waitFor();
    await screenshot(page, evidenceDir, "01-book-heading.png");

    const peek = page.locator("#peek");
    await peek.waitFor({ state: "visible" });
    await peek.getByText(/A bedtime peek · 1 of/).waitFor();
    await page.getByRole("button", { name: "Next page →", exact: true }).click();
    await peek.getByText(/A bedtime peek · 2 of/).waitFor();
    await screenshot(page, evidenceDir, "02-book-peek-page-2.png");
    await writeAria(page, evidenceDir, "#peek");

    const amazon = page.getByRole("link", { name: "Buy on Amazon →" });
    const href = await amazon.getAttribute("href");
    if (!href || !/amazon\.com/.test(href)) {
      throw new Error(`Buy on Amazon href was ${href}`);
    }

    writeNotes(evidenceDir, {
      feature: "book-pages",
      entryPoint: `/book/${slug}`,
      slug,
      amazonHref: href,
      baseUrl,
      doctorOk: doctor.ok,
    });
  });
}
