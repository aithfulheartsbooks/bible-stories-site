import { books } from "@/app/books";

export function GET() {
  const availableBooks = books
    .filter((book) => book.status === "available")
    .map((book) => ({
      number: book.number,
      numberValue: Number(book.number.replace(/\D/g, "")) || 0,
      slug: book.slug,
      title: book.title,
      subtitle: book.subtitle || "",
      ageRange: book.ageRange || "",
      theme: book.theme || "",
      desc: book.blurb || "",
      scriptureReference: book.scriptureReference || "",
      biblicalOrder: book.biblicalOrder ?? null,
      songTitle: book.song?.title || "",
      songArtist: book.song?.artist || "",
      songEmbedId: book.song?.embedId || "",
      songYoutubeUrl: book.song?.embedId
        ? `https://www.youtube.com/watch?v=${book.song.embedId}`
        : "",
      songEmbedUrl: book.song?.embedId
        ? `https://www.youtube.com/embed/${book.song.embedId}`
        : "",
      bookUrl: `https://www.faithfulheartsbooks.com/book/${book.slug}`,
      amazonUrl:
        book.amazonUrl || `https://www.faithfulheartsbooks.com/book/${book.slug}`,
    }));

  return Response.json({
    count: availableBooks.length,
    books: availableBooks,
  });
}
