"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Book } from "@/app/books";
import BookCard from "@/components/BookCard";

const DESKTOP_BOOKS_PER_PAGE = 18;
const MOBILE_BOOKS_PER_PAGE = 9;

const THEME_FILTERS = [
  "All Books",
  "Trust",
  "Courage",
  "Faith",
  "Obedience",
  "Prayer",
  "Bravery",
  "Love",
  "Forgiveness",
  "Hope",
  "Loyalty",
  "Protection",
  "Wisdom",
  "Listening",
  "Peace",
  "Wonder",
] as const;

type ThemeFilter = (typeof THEME_FILTERS)[number];
type SortMode = "publication" | "az";
type Testament = "old" | "new";

type SeriesPlacement = {
  order: number;
  testament: Testament;
};

const TIMELINE_OVERRIDES: Array<{
  pattern: RegExp;
  order: number;
  testament: Testament;
}> = [
  { pattern: /^genesis\s+1\b/i, order: 100, testament: "old" },
  { pattern: /^genesis\s+6/i, order: 110, testament: "old" },
  { pattern: /^genesis\s+37/i, order: 120, testament: "old" },
  { pattern: /^exodus\s+1/i, order: 130, testament: "old" },
  { pattern: /^exodus\s+14\b/i, order: 140, testament: "old" },
  { pattern: /^(book of )?ruth\b/i, order: 150, testament: "old" },
  { pattern: /^1\s*samuel\s+17\b/i, order: 160, testament: "old" },
  { pattern: /^1\s*kings\s+3\b/i, order: 170, testament: "old" },
  { pattern: /^1\s*kings\s+19\b/i, order: 180, testament: "old" },
  { pattern: /^(book of )?esther\b/i, order: 190, testament: "old" },
  { pattern: /^daniel\s+6\b/i, order: 200, testament: "old" },
  { pattern: /^(book of )?jonah\b/i, order: 210, testament: "old" },
  { pattern: /^luke\s+2\b/i, order: 1000, testament: "new" },
  { pattern: /^mark\s+4\b/i, order: 1010, testament: "new" },
  { pattern: /^matthew\s+28\b/i, order: 1020, testament: "new" },
];

const BIBLE_BOOK_ORDER: Record<string, SeriesPlacement> = {
  genesis: { order: 100, testament: "old" },
  exodus: { order: 200, testament: "old" },
  ruth: { order: 800, testament: "old" },
  "1 samuel": { order: 900, testament: "old" },
  "1 kings": { order: 1100, testament: "old" },
  esther: { order: 1700, testament: "old" },
  daniel: { order: 1800, testament: "old" },
  jonah: { order: 2000, testament: "old" },
  matthew: { order: 4000, testament: "new" },
  mark: { order: 4100, testament: "new" },
  luke: { order: 4200, testament: "new" },
  john: { order: 4300, testament: "new" },
  acts: { order: 4400, testament: "new" },
};

function parseBookNumber(book: Book) {
  return Number(book.number.replace(/\D/g, "")) || 0;
}

function normalizeReference(reference: string) {
  return reference
    .toLowerCase()
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/^book of /, "")
    .trim();
}

function chapterOffset(reference: string) {
  const match = reference.match(/\b(\d+)\b/);
  return match ? Number(match[1]) / 100 : 0;
}

function getSeriesPlacement(book: Book): SeriesPlacement | null {
  if (typeof book.biblicalOrder === "number") {
    return {
      order: book.biblicalOrder,
      testament: book.biblicalOrder >= 130 ? "new" : "old",
    };
  }

  if (!book.scriptureReference) return null;

  const reference = normalizeReference(book.scriptureReference);
  const override = TIMELINE_OVERRIDES.find(({ pattern }) =>
    pattern.test(reference),
  );

  if (override) {
    return { order: override.order, testament: override.testament };
  }

  const bibleBook = Object.keys(BIBLE_BOOK_ORDER)
    .sort((a, b) => b.length - a.length)
    .find((name) => reference.startsWith(name));

  if (!bibleBook) return null;

  const placement = BIBLE_BOOK_ORDER[bibleBook];
  return {
    order: placement.order + chapterOffset(reference),
    testament: placement.testament,
  };
}

function matchesTheme(book: Book, activeTheme: ThemeFilter) {
  if (activeTheme === "All Books") return true;
  if (activeTheme === "Loyalty") {
    return book.theme === "Loyalty" || book.theme === "Loyal Love";
  }

  return book.theme === activeTheme;
}

function sortBooks(books: Book[], sortMode: SortMode) {
  if (sortMode === "publication") return books;

  return [...books].sort((a, b) => {
    const byTitle = a.title.localeCompare(b.title);
    return byTitle || parseBookNumber(a) - parseBookNumber(b);
  });
}

type Props = {
  books: Book[];
};

function useBooksPerPage() {
  const [booksPerPage, setBooksPerPage] = useState(DESKTOP_BOOKS_PER_PAGE);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 600px)");
    const updateBooksPerPage = () => {
      setBooksPerPage(
        mediaQuery.matches ? DESKTOP_BOOKS_PER_PAGE : MOBILE_BOOKS_PER_PAGE,
      );
    };

    updateBooksPerPage();
    mediaQuery.addEventListener("change", updateBooksPerPage);

    return () => {
      mediaQuery.removeEventListener("change", updateBooksPerPage);
    };
  }, []);

  return booksPerPage;
}

export default function BookCollection({ books }: Props) {
  const [activeTheme, setActiveTheme] = useState<ThemeFilter>("All Books");
  const [sortMode, setSortMode] = useState<SortMode>("publication");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = useBooksPerPage();

  const filteredBooks = useMemo(() => {
    return sortBooks(
      books.filter((book) => matchesTheme(book, activeTheme)),
      sortMode,
    );
  }, [activeTheme, books, sortMode]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredBooks.length / booksPerPage),
  );
  const visibleBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage,
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, pageCount));
  }, [pageCount]);

  function selectTheme(theme: ThemeFilter) {
    setActiveTheme(theme);
    setCurrentPage(1);
    if (theme === "All Books") setSortMode("publication");
  }

  function selectSort(mode: SortMode) {
    setSortMode(mode);
    setCurrentPage(1);
  }

  return (
    <>
      <section
        id="books"
        className="mx-auto max-w-[1800px] px-4 pb-16 pt-8 sm:px-6"
      >
        <div className="opacity-0 animate-fade-up mb-12 text-center">
          <div className="mb-2 text-xl tracking-[0.5em] text-gold">
            {"\u2726 \u2726 \u2726"}
          </div>
          <h2 className="font-display text-3xl font-semibold text-chestnut">
            Our Storybook Collection
          </h2>
        </div>

        <div className="mb-8 flex flex-col gap-5 rounded-3xl border border-white/70 bg-cream/70 p-4 shadow-sm backdrop-blur-sm sm:p-5">
          <div className="flex flex-wrap justify-center gap-2">
            {THEME_FILTERS.map((theme) => {
              const isActive = activeTheme === theme;

              return (
                <button
                  key={theme}
                  type="button"
                  onClick={() => selectTheme(theme)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-[#b5541e] bg-[#b5541e] text-cream shadow-md"
                      : "border-terracotta/20 bg-white/60 text-chestnut-soft hover:border-terracotta/50 hover:text-terracotta"
                  }`}
                >
                  {theme}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-chestnut-soft">
            <span className="px-2">Sort</span>
            <button
              type="button"
              onClick={() => selectSort("publication")}
              className={`rounded-full border px-4 py-2 transition ${
                sortMode === "publication"
                  ? "border-terracotta bg-terracotta text-cream"
                  : "border-terracotta/25 bg-white/55 hover:border-terracotta/50"
              }`}
            >
              Book Order
            </button>
            <button
              type="button"
              onClick={() => selectSort("az")}
              className={`rounded-full border px-4 py-2 transition ${
                sortMode === "az"
                  ? "border-terracotta bg-terracotta text-cream"
                  : "border-terracotta/25 bg-white/55 hover:border-terracotta/50"
              }`}
            >
              A-Z
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 min-[600px]:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
          {visibleBooks.map((book, index) => (
            <BookCard key={book.slug} book={book} index={index} />
          ))}
        </div>

        {pageCount > 1 && (
          <nav
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
            aria-label="Book collection pages"
          >
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="rounded-full border border-terracotta/25 bg-cream/80 px-4 py-2 text-sm font-semibold text-chestnut-soft transition hover:border-terracotta hover:text-terracotta disabled:cursor-not-allowed disabled:opacity-45"
            >
              Previous
            </button>

            {Array.from({ length: pageCount }, (_, index) => {
              const page = index + 1;
              const isActive = currentPage === page;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`h-10 min-w-10 rounded-full border px-3 text-sm font-bold transition ${
                    isActive
                      ? "border-terracotta bg-terracotta text-cream shadow-md"
                      : "border-terracotta/25 bg-cream/80 text-chestnut-soft hover:border-terracotta hover:text-terracotta"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(pageCount, page + 1))
              }
              disabled={currentPage === pageCount}
              className="rounded-full border border-terracotta/25 bg-cream/80 px-4 py-2 text-sm font-semibold text-chestnut-soft transition hover:border-terracotta hover:text-terracotta disabled:cursor-not-allowed disabled:opacity-45"
            >
              Next
            </button>
          </nav>
        )}
      </section>

      <SeriesMap books={books} />
    </>
  );
}

function SeriesMap({ books }: Props) {
  const timelineBooks = books
    .map((book) => {
      const placement = getSeriesPlacement(book);
      return placement ? { book, placement } : null;
    })
    .filter((item): item is { book: Book; placement: SeriesPlacement } =>
      Boolean(item),
    )
    .sort((a, b) => {
      const byOrder = a.placement.order - b.placement.order;
      return byOrder || parseBookNumber(a.book) - parseBookNumber(b.book);
    });

  const groups: Array<{ label: string; testament: Testament }> = [
    { label: "Old Testament", testament: "old" },
    { label: "New Testament", testament: "new" },
  ];

  return (
    <section
      id="series-map"
      className="mx-auto max-w-[1800px] px-4 pb-20 sm:px-6"
    >
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 h-0.5 w-16 rounded bg-gold/50" />
        <h2 className="font-display text-3xl font-semibold text-chestnut">
          Series Map
        </h2>
      </div>

      <div className="space-y-10">
        {groups.map((group) => {
          const groupBooks = timelineBooks.filter(
            ({ placement }) => placement.testament === group.testament,
          );

          if (groupBooks.length === 0) return null;

          return (
            <div key={group.testament}>
              <h3 className="mb-4 font-display text-xl font-semibold text-chestnut">
                {group.label}
              </h3>
              <div className="overflow-x-auto pb-4">
                <ol className="flex min-w-max items-stretch gap-4">
                  {groupBooks.map(({ book }, index) => (
                    <li key={book.slug} className="flex items-center gap-4">
                      <Link
                        href={`/book/${book.slug}`}
                        className="group flex w-40 flex-col items-center rounded-3xl border border-white/80 bg-cream/80 p-3 text-center shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-md"
                      >
                        <div className="relative mb-3 aspect-[2/3] w-20 overflow-hidden rounded-xl bg-cream-deep shadow-sm">
                          {book.coverImage ? (
                            <Image
                              src={book.coverImage}
                              alt={`${book.title} cover thumbnail`}
                              fill
                              sizes="80px"
                              className="object-contain"
                            />
                          ) : null}
                        </div>
                        <span className="mb-1 text-xs font-bold uppercase tracking-wider text-terracotta">
                          {book.number}
                        </span>
                        <span className="font-display text-sm font-semibold leading-tight text-chestnut">
                          {book.title}
                        </span>
                        <span className="mt-2 text-xs font-semibold text-chestnut-soft">
                          {book.scriptureReference}
                        </span>
                      </Link>

                      {index < groupBooks.length - 1 && (
                        <span
                          className="flex h-px w-10 items-center bg-terracotta/45 text-terracotta"
                          aria-hidden="true"
                        >
                          <span className="ml-auto translate-x-1 text-sm leading-none">
                            &gt;
                          </span>
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
