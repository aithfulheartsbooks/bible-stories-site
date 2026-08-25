import { books } from "../books";
import { PLAY_IS_LIVE } from "@/lib/play/config";

const baseUrl = "https://www.faithfulheartsbooks.com";
const lastmod = "2026-08-25";

const urls = [
  { loc: `${baseUrl}/`, changefreq: "weekly", priority: "1.0" },
  { loc: `${baseUrl}/tonight`, changefreq: "daily", priority: "0.9" },
  { loc: `${baseUrl}/churches`, changefreq: "weekly", priority: "0.8" },
  { loc: `${baseUrl}/about`, changefreq: "monthly", priority: "0.7" },
  { loc: `${baseUrl}/free-resources`, changefreq: "monthly", priority: "0.7" },
  { loc: `${baseUrl}/contact`, changefreq: "monthly", priority: "0.5" },
  ...books
    .filter((book) => book.status === "available")
    .map((book) => ({
      loc: `${baseUrl}/book/${book.slug}`,
      changefreq: "monthly",
      priority: "0.8",
    })),
];

if (PLAY_IS_LIVE) {
  urls.push({ loc: `${baseUrl}/play`, changefreq: "daily", priority: "0.7" });
}

export function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${lastmod}</lastmod>
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
