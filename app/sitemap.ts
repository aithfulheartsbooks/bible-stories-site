import { books } from "./books";

export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://faithfulheartsbooks.com";
  const availableBooks = books.filter((book) => book.status === "available");

  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
    },
    ...availableBooks.map((book) => ({
      url: `${baseUrl}/book/${book.slug}`,
      lastModified: new Date().toISOString(),
    })),
  ];
}
