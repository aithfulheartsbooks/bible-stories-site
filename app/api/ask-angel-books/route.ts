import { books } from "@/app/books";

export function GET() {
  const availableBooks = books
    .filter((book) => book.status === "available")
    .map((book) => ({
      number: book.number,
      title: book.title,
      theme: book.theme || "",
      desc: book.blurb || "",
      amazonUrl: book.amazonUrl || `https://www.faithfulheartsbooks.com/book/${book.slug}`,
    }));

  return Response.json({
    count: availableBooks.length,
    books: availableBooks,
  });
}
