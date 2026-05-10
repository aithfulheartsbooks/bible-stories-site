const baseUrl = "https://www.faithfulheartsbooks.com";

const urls = [
  { loc: `${baseUrl}/`, lastmod: "2026-05-01", changefreq: "weekly", priority: "1.0" },
  { loc: `${baseUrl}/book/noah-and-gods-big-promise`, lastmod: "2026-05-01", changefreq: "monthly", priority: "0.8" },
  { loc: `${baseUrl}/book/david-and-the-giant`, lastmod: "2026-05-01", changefreq: "monthly", priority: "0.8" },
  { loc: `${baseUrl}/book/moses-and-the-red-sea`, lastmod: "2026-05-01", changefreq: "monthly", priority: "0.8" },
  { loc: `${baseUrl}/book/jonah-and-the-big-fish`, lastmod: "2026-05-03", changefreq: "monthly", priority: "0.8" },
  { loc: `${baseUrl}/book/daniel-and-the-lions`, lastmod: "2026-05-03", changefreq: "monthly", priority: "0.8" },
  { loc: `${baseUrl}/book/esther-the-brave-queen`, lastmod: "2026-05-05", changefreq: "monthly", priority: "0.8" },
  { loc: `${baseUrl}/book/the-christmas-story`, lastmod: "2026-05-06", changefreq: "monthly", priority: "0.8" },
  { loc: `${baseUrl}/book/josephs-colorful-coat`, lastmod: "2026-05-06", changefreq: "monthly", priority: "0.8" },
  { loc: `${baseUrl}/book/the-easter-story`, lastmod: "2026-05-06", changefreq: "monthly", priority: "0.8" },
  { loc: `${baseUrl}/book/ruth-and-naomi`, lastmod: "2026-05-06", changefreq: "monthly", priority: "0.8" },
  { loc: `${baseUrl}/book/the-birth-of-moses`, lastmod: "2026-05-09", changefreq: "monthly", priority: "0.8" },
  { loc: `${baseUrl}/book/solomon-and-wisdom`, lastmod: "2026-05-10", changefreq: "monthly", priority: "0.8" },
  { loc: `${baseUrl}/book/elijah-and-the-still-small-voice`, lastmod: "2026-05-10", changefreq: "monthly", priority: "0.8" },
  { loc: `${baseUrl}/book/jesus-calms-the-storm`, lastmod: "2026-05-10", changefreq: "monthly", priority: "0.8" },
  { loc: `${baseUrl}/book/the-creation-story`, lastmod: "2026-05-10", changefreq: "monthly", priority: "0.8" },
];

export function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
