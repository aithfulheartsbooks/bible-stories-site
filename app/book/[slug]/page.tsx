import { books } from "@/app/books";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export default function BookPage({ params }: { params: { slug: string } }) {
  const book = books.find((b) => b.slug === params.slug);

  if (!book) return notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
      <p className="mb-4 italic">{book.subtitle}</p>
      <p className="mb-6">{book.blurb}</p>

      {book.status === "available" && book.amazonUrl && (
        <a
          href={book.amazonUrl}
          target="_blank"
          className="bg-terracotta text-white px-6 py-3 rounded-full"
        >
          Buy on Amazon
        </a>
      )}
    </div>
  );
}
