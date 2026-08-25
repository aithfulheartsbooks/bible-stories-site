import { books, type Book } from "@/app/books";

export function availableBooks() {
  return books.filter((book) => book.status === "available" && book.amazonUrl);
}

export function todaysBook(now = new Date()) {
  const list = availableBooks();
  const start = new Date(now.getFullYear(), 0, 1);
  const day = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  return list[((day % list.length) + list.length) % list.length];
}

export type TonightMood = "brave" | "cozy" | "curious" | "hug";
export type TonightLens = "jesus" | "heroes" | "parable" | "holiday" | "surprise";

const MOOD_THEMES: Record<TonightMood, string[]> = {
  brave: ["Courage", "Bravery"],
  cozy: ["Peace", "Trust", "Prayer", "Protection"],
  curious: ["Wonder", "Wisdom", "Listening", "Faith"],
  hug: ["Love", "Forgiveness", "Hope", "Loyal Love"],
};

function slugFlags(slug: string) {
  const s = slug.toLowerCase();
  const holiday = s.includes("christmas") || s.includes("easter");
  const parable =
    s.includes("lost-sheep") ||
    s.includes("prodigal") ||
    s.includes("good-samaritan");
  const jesus =
    s.includes("jesus") ||
    s.includes("christmas") ||
    s.includes("easter") ||
    s.includes("lazarus") ||
    s.includes("zacchaeus") ||
    s.includes("pentecost") ||
    s.includes("wedding-at-cana") ||
    s.includes("feeding") ||
    s.includes("paul") ||
    parable;
  return { holiday, parable, jesus };
}

export function findTonight(mood: TonightMood, lens: TonightLens, limit = 3) {
  const wanted = MOOD_THEMES[mood];
  const scored = availableBooks().map((book) => {
    const flags = slugFlags(book.slug);
    let score = 0;
    if (book.theme && wanted.includes(book.theme)) score += 5;
    if (lens === "jesus" && flags.jesus) score += 4;
    if (lens === "holiday" && flags.holiday) score += 6;
    if (lens === "parable" && flags.parable) score += 6;
    if (lens === "heroes" && !flags.jesus) score += 3;
    if (lens === "surprise") score += 1;
    return { book, score };
  });
  scored.sort((a, b) => b.score - a.score || a.book.slug.localeCompare(b.book.slug));
  return scored.slice(0, limit).map((row) => row.book);
}

export function booksForTheme(theme: string) {
  return availableBooks().filter((book) => book.theme === theme).slice(0, 3);
}

export const BOOK_THEMES = Array.from(
  new Set(
    availableBooks()
      .map((book) => book.theme)
      .filter((theme): theme is string => Boolean(theme)),
  ),
);

export function kitForTheme(theme: string, limit = 3) {
  const primary = availableBooks().filter((book) => book.theme === theme);
  const rest = availableBooks().filter((book) => book.theme !== theme);
  return [...primary, ...rest].slice(0, limit);
}

export function thisWeeksTheme(now = new Date()) {
  const themes = BOOK_THEMES;
  if (themes.length === 0) return "Love";
  const start = new Date(now.getFullYear(), 0, 1);
  const week = Math.floor((now.getTime() - start.getTime()) / (7 * 86_400_000));
  return themes[((week % themes.length) + themes.length) % themes.length];
}

export function weekRangeLabel(now = new Date()) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}

export type { Book };
