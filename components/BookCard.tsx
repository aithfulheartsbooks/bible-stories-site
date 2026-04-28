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

  if (!isAvailable) {
    return (
      <article
        className="opacity-0 animate-fade-up flex flex-col rounded-3xl border-2 border-dashed border-terracotta/35 bg-cream/55 p-7 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:rotate-[0.3deg] hover:border-terracotta/60"
        style={{ animationDelay }}
      >
        <div className="relative mb-6 flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cream-deep to-peach shadow-inner">
          <div className="absolute right-4 top-4 z-10 rounded-full bg-cream/95 px-3 py-1.5 font-display text-xs font-semibold tracking-wider text-terracotta">
            {book.number}
          </div>
          <div className="text-center font-display italic text-terracotta/70">
            <span className="mb-2 block animate-twinkle text-4xl">✦</span>
            Coming Soon
          </div>
        </div>
        <h3 className="mb-1.5 font-display text-2xl font-bold leading-tight text-chestnut">
          {book.title}
        </h3>
        <p className="font-display text-sm italic text-chestnut-soft">
          {book.subtitle}
        </p>
      </article>
    );
  }

  return (
    <article
      className="group opacity-0 animate-fade-up flex flex-col rounded-3xl border border-white/80 bg-cream/85 p-7 backdrop-blur-md shadow-[0_4px_12px_rgba(122,86,64,0.08),0_12px_32px_rgba(122,86,64,0.06)] transition-all duration-500 hover:-translate-y-2 hover:-rotate-[0.5deg] hover:shadow-[0_8px_20px_rgba(122,86,64,0.12),0_20px_48px_rgba(122,86,64,0.1)]"
      style={{ animationDelay }}
    >
      <div className="relative mb-6 aspect-square overflow-hidden rounded-2xl shadow-md">
        <div className="absolute right-4 top-4 z-10 rounded-full bg-cream/95 px-3 py-1.5 font-display text-xs font-semibold tracking-wider text-terracotta">
          {book.number}
        </div>
        <CoverComponent />
      </div>

      <h3 className="mb-1.5 font-display text-2xl font-bold leading-tight text-chestnut">
        {book.title}
      </h3>

      <p className="mb-4 font-display text-base italic text-chestnut-soft">
        {book.subtitle}
      </p>

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

      <a
        href={book.amazonUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold text-cream shadow-md shadow-terracotta/30 transition-all hover:scale-[1.03] hover:bg-chestnut hover:shadow-lg hover:shadow-terracotta/40"
      >
        Find on Amazon
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </a>
    </article>
  );
}
