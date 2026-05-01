import { books } from "@/app/books";
import { notFound } from "next/navigation";
import Image from "next/image";

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export default function BookPage({ params }: { params: { slug: string } }) {
  const book = books.find((b) => b.slug === params.slug);

  if (!book) return notFound();

  const isNoah = book.slug === "noah-and-gods-big-promise";

  return (
    <div className={isNoah ? "bg-blue-50 min-h-screen" : "bg-white min-h-screen"}>
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-chestnut">
            {book.title}
          </h1>
          <p className="text-lg italic text-chestnut-soft">
            {book.subtitle}
          </p>
        </div>

        {/* Cover */}
        <div className="flex flex-col items-center mb-12">
          {book.coverImage && (
            <div className="w-[260px] h-[390px] relative mb-6">
              <Image
                src={book.coverImage}
                alt={book.title}
                fill
                className="object-contain rounded-xl shadow-lg"
              />
            </div>
          )}

          {isNoah && (
            <p className="text-center text-lg text-blue-700 font-semibold max-w-md">
              When the storms come, God’s promises always shine like a rainbow.
            </p>
          )}
        </div>

        {/* Description */}
        <div className="mb-10 text-center">
          <p className="text-base text-chestnut-soft leading-relaxed max-w-xl mx-auto">
            {book.blurb}
          </p>
        </div>

        {/* Theme */}
        {book.theme && (
          <div className="mb-10 text-center">
            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              Theme: {book.theme}
            </span>
          </div>
        )}

        {/* CTA */}
        {book.status === "available" && book.amazonUrl && (
          <div className="text-center">
            <a
              href={book.amazonUrl}
              target="_blank"
              className="inline-block bg-terracotta text-white px-8 py-4 rounded-full text-lg font-semibold shadow-md hover:scale-105 transition"
            >
              Buy on Amazon →
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
