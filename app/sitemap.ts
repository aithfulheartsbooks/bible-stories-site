export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bible-stories-for-little-hearts.vercel.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
  ];
}
