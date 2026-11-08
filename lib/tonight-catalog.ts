import { books } from "@/app/books";
import { resources, type Resource } from "@/app/resources";

export type TonightPrintable = {
  bookSlug: string;
  bookNumber: string;
  bookTitle: string;
  type: "Coloring Page";
  description: string;
  href: string;
  previewSrc: string;
  previewAlt: string;
};

export type SeriesBadge = {
  slug: string;
  number: number;
  numberLabel: string;
  title: string;
  coverImage: string;
};

const COLORING_PAGE: TonightPrintable["type"] = "Coloring Page";

function coloringPageFor(bookNumber: string): Resource | null {
  const matches = resources.filter(
    (resource) => resource.type === COLORING_PAGE && resource.book === bookNumber,
  );
  if (matches.length !== 1) return null;
  const resource = matches[0];
  if (!resource.href || !resource.previewSrc || !resource.description) return null;
  return resource;
}

function seriesNumber(bookNumber: string) {
  const value = Number(bookNumber.replace(/\D/g, ""));
  return Number.isInteger(value) ? value : null;
}

const printableEntries = books.flatMap((book) => {
  if (book.status !== "available") return [];
  const resource = coloringPageFor(book.number);
  if (!resource?.href || !resource.previewSrc) return [];
  const printable: TonightPrintable = {
    bookSlug: book.slug,
    bookNumber: book.number,
    bookTitle: book.title,
    type: COLORING_PAGE,
    description: resource.description,
    href: resource.href,
    previewSrc: resource.previewSrc,
    previewAlt: resource.previewAlt ?? `Preview of ${book.title} coloring page`,
  };
  return [[book.slug, printable] as const];
});

/** Coloring pages joined to catalog slugs by book number. Missing or ambiguous sheets are absent. */
export const tonightPrintables: Readonly<Record<string, TonightPrintable>> =
  Object.freeze(Object.fromEntries(printableEntries));

export function printableForSlug(slug: string): TonightPrintable | null {
  return tonightPrintables[slug] ?? null;
}

export const seriesBadges: readonly SeriesBadge[] = books.flatMap((book) => {
  if (book.status !== "available" || !book.coverImage) return [];
  const number = seriesNumber(book.number);
  if (number == null) return [];
  return [
    {
      slug: book.slug,
      number,
      numberLabel: String(number),
      title: book.title,
      coverImage: book.coverImage,
    },
  ];
});

export const seriesSlugSet: ReadonlySet<string> = new Set(seriesBadges.map((badge) => badge.slug));
