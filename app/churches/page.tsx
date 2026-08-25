import type { Metadata } from "next";
import { BOOK_THEMES, booksForTheme } from "@/lib/tonight";
import BookCard from "@/components/BookCard";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import Link from "next/link";
import ChurchesShare from "./ChurchesShare";

export const metadata: Metadata = {
  title: "Sunday School Kits | Bible Stories for Little Hearts",
  description:
    "Match this week's classroom theme to a Bible picture book, then order paperbacks on Amazon.",
  alternates: { canonical: "/churches" },
};

const AMAZON_AUTHOR =
  "https://www.amazon.com/stores/author/B0GYBZMYD2";

export default function ChurchesPage({
  searchParams,
}: {
  searchParams: { theme?: string };
}) {
  const theme =
    searchParams.theme && BOOK_THEMES.includes(searchParams.theme)
      ? searchParams.theme
      : BOOK_THEMES[0] ?? "Love";
  const matches = booksForTheme(theme);

  return (
    <main className="relative min-h-screen overflow-x-hidden font-body text-chestnut">
      <div className="scenery" />
      <SiteNav />

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-16 pt-32">
        <span className="mb-4 inline-block rounded-full border border-terracotta/20 bg-white/55 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta backdrop-blur-sm">
          Sunday school · homeschool
        </span>
        <h1 className="max-w-2xl font-display text-4xl font-extrabold text-chestnut sm:text-5xl">
          A picture book for every lesson
        </h1>
        <p className="mt-4 max-w-2xl font-display text-lg italic text-chestnut-soft">
          Pick a theme your class is living in this week. Order the paperbacks
          on Amazon — one copy or a whole shelf.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {BOOK_THEMES.map((name) => (
            <Link
              key={name}
              href={`/churches?theme=${encodeURIComponent(name)}`}
              className={
                theme === name
                  ? "rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-cream"
                  : "rounded-full border border-terracotta/25 bg-cream/80 px-4 py-2 text-sm font-semibold text-chestnut-soft"
              }
            >
              {name}
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((book, index) => (
            <BookCard key={book.slug} book={book} index={index} />
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-white/80 bg-cream/85 p-8 text-center shadow-md">
          <h2 className="font-display text-3xl font-bold text-chestnut">
            Order for the classroom
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-chestnut-soft">
            Each kit book has its own Amazon button. The full series is on
            Faith's author page.
          </p>
          <a
            href={AMAZON_AUTHOR}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold text-cream shadow-md transition hover:bg-chestnut"
          >
            Shop the series on Amazon →
          </a>
          <ChurchesShare theme={theme} />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
