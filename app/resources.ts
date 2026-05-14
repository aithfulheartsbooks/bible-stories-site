import { books } from "@/app/books";

export type Resource = {
  title: string;
  type: string;
  book?: string;
  description: string;
  href: string;
};

type BookResourceMeta = {
  number: string;
  title: string;
  resourceSlug: string;
};

const familyPrintables: Resource[] = [
  {
    title: "Bible Stories Reading Tracker",
    type: "Reading Tracker",
    description:
      "A gentle checklist to help little hearts follow along as the series grows.",
    href: "/resources/bible-stories-reading-tracker.pdf",
  },
  {
    title: "Bible Verse Cards for Little Hearts",
    type: "Verse Cards",
    description:
      "Simple printable cards for bedtime, story time, memory practice, or encouragement.",
    href: "/resources/bible-verse-cards-for-little-hearts.pdf",
  },
  {
    title: "Bedtime Prayer Cards",
    type: "Prayer",
    description:
      "Short, tender prayers families can use before sleep or after story time.",
    href: "/resources/bedtime-prayer-cards.pdf",
  },
  {
    title: "Family Story Time Cards",
    type: "Story Time",
    description:
      "Gentle discussion prompts that work with any book in the series.",
    href: "/resources/family-story-time-cards.pdf",
  },
  {
    title: "My Favorite Bible Story Activity Sheet",
    type: "Activity Sheet",
    description:
      "A simple draw-and-respond page children can use after any story.",
    href: "/resources/my-favorite-bible-story-activity-sheet.pdf",
  },
];

const coloringPageSlugsByBook: Record<string, string> = {
  "Book 01": "noah-and-gods-big-promise",
  "Book 02": "david-and-the-giant",
  "Book 03": "moses-and-the-red-sea",
  "Book 04": "jonah-and-the-big-fish",
  "Book 05": "daniel-and-the-lions",
  "Book 06": "esther-the-brave-queen",
  "Book 07": "the-christmas-story",
  "Book 08": "josephs-colorful-coat",
  "Book 09": "the-easter-story",
  "Book 10": "ruth-and-naomi",
  "Book 11": "the-birth-of-moses",
  "Book 12": "solomon-and-wisdom",
  "Book 13": "elijah-and-the-still-small-voice",
  "Book 14": "jesus-calms-the-storm",
  "Book 15": "the-creation-story",
  "Book 16": "the-armor-of-god",
  "Book 17": "zacchaeus",
  "Book 18": "the-good-samaritan",
  "Book 19": "the-lost-sheep",
  "Book 20": "feeding-the-5000",
  "Book 21": "adam-and-eve",
};

const publishedBookResources: BookResourceMeta[] = books
  .filter((book) => book.status === "available")
  .map((book) => ({
    number: book.number,
    title: book.title,
    resourceSlug:
      coloringPageSlugsByBook[book.number] ??
      book.slug.replace(/^the-feeding-of-the-/, "feeding-the-"),
  }));

const memoryVersePosters: Resource[] = publishedBookResources.map((book) => ({
  title: `${book.title} Memory Verse Poster`,
  type: "Poster",
  book: book.number,
  description: `A printable 5x7 memory verse poster from ${book.title}. Display it in a bedroom, nursery, or classroom.`,
  href: `/resources/${book.resourceSlug}-verse-poster.pdf`,
}));

const lessonPacks: Resource[] = publishedBookResources.map((book) => ({
  title: `${book.title} Lesson Pack`,
  type: "Lesson Pack",
  book: book.number,
  description: `A one-page Sunday school guide for ${book.title} - includes a key verse, story summary, discussion questions, and a simple activity.`,
  href: `/resources/${book.resourceSlug}-lesson-pack.pdf`,
}));

const devotionals: Resource[] = publishedBookResources.map((book) => ({
  title: `${book.title} 5-Day Devotional`,
  type: "Devotional",
  book: book.number,
  description: `A printable 5-day devotional for families using ${book.title} - a short focus for each day of the week.`,
  href: `/resources/${book.resourceSlug}-devotional.pdf`,
}));

const coloringPages: Resource[] = publishedBookResources.map((book) => ({
  title: `${book.title} Coloring Page`,
  type: "Coloring Page",
  book: book.number,
  description: `A printable coloring page from ${book.title} artwork.`,
  href: `/resources/${book.resourceSlug}-coloring-page.pdf`,
}));

export const resources: Resource[] = [
  ...familyPrintables,
  ...memoryVersePosters,
  ...lessonPacks,
  ...devotionals,
  ...coloringPages,
];
