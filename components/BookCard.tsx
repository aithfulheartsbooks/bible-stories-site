import Image from "next/image";
import type { Book } from "@/app/books";
import { coverMap } from "./BookCovers";

type Props = {
  book: Book;
  index: number;
};

export default function BookCard({ book, index }: Props) {
  const animationDelay = `${0.15 + index * 0.08}s`;
  const isAvailable = book.status === "available";
  const CoverComponent = coverMap[book.coverScene || "default"];

  return (
    <article
      className={
        isAvailable
          ? "group opacity-0 animate-fade-up flex flex-col rounded-3xl border border-white/80 bg-cream/85 p-7 backdrop-blur-md shadow-md transition-all duration-500 hover:-translate-y-2"
          : "opacity-0 animate-fade-up flex flex-col rounded-3xl border-2 border-dashed border-terracotta/35 bg-cream/55 p-7 backdrop-blur-md transition-all duration-500 hover:-translate-y-1"
      }
      style={{ animationDelay }}
    >
      <div className="relative mb-6 aspect-[2/3] overflow-hidden rounded-2xl bg-cream-deep shadow-md">
        <div className="absolute right-4 top-4 z-10 rounded-full bg-cream/95 px-3 py-1.5 font-display text-xs font-semibold tracking-wider text-terracotta shadow-sm">
          {book.number}
        </div>
        {isAvailable && book.coverImage ? (
          <Image
            src={book.coverImage}
            alt={`${book.title} book cover`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain"
            priority={index < 3}
          />
        ) : isAvailable ? (
          <CoverComponent />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cream-deep to-peach text-center font-display italic text-terracotta/70">
            <div>
              <span className="mb-2 block animate-twinkle text-4xl">✦</span>
              Coming Soon
            </div>
          </div>
        )}
      </div>

      <h3 className="mb-1.5 font-display text-2xl font-bold leading-tight text-chestnut">
        {book.title}
      </h3>

      <p className="mb-4 font-display text-base italic text-chestnut-soft">
        {book.subtitle}
      </p>

      {isAvailable && (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {book.ageRange && (
              <span className="rounded-full bg-cream-deep px-3 py-1 text-xs font-semibold uppercase tracking-wider text-chestnut-soft">
                {book.ageRange}
              </span>
            )}
            {book.theme && (
              <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold">
                {book.theme}
              </span>
            )}
          </div>

          <p className="mb-6 flex-grow text-sm leading-relaxed text-chestnut-soft">
            {book.blurb}
          </p>

          
            href={book.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold text-cream shadow-md transition-all hover:scale-105 hover:bg-chestnut"
          >
            Find on Amazon →
          </a>
        </>
      )}
    </article>
  );
}
