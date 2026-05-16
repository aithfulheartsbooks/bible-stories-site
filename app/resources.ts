import { books } from "@/app/books";

export type Resource = {
  title: string;
  type: string;
  icon?: string;
  previewSrc?: string;
  previewAlt?: string;
  book?: string;
  section: string;
  groupLabel?: string;
  description: string;
  href: string;
};

type BookResourceMeta = {
  number: string;
  title: string;
  resourceSlug: string;
};

type PerBookResourceType = {
  type: string;
  icon: string;
  suffix: string;
  previewSuffix?: string;
  previewFolder?: string;
  section: string;
  groupLabel?: string;
  titleTemplate: string;
  descriptionTemplate: string;
};

const familyPrintables: Resource[] = [
  {
    title: "Bible Stories Reading Tracker",
    type: "Reading Tracker",
    section: "Family Printables",
    description:
      "A gentle checklist to help little hearts follow along as the series grows.",
    href: "/resources/bible-stories-reading-tracker.pdf",
  },
  {
    title: "Bible Verse Cards for Little Hearts",
    type: "Verse Cards",
    section: "Family Printables",
    description:
      "Simple printable cards for bedtime, story time, memory practice, or encouragement.",
    href: "/resources/bible-verse-cards-for-little-hearts.pdf",
  },
  {
    title: "A-Z Bible Verse Sheet",
    type: "Verse Cards",
    section: "Family Printables",
    description:
      "A printable A to Z sheet - one simple Bible verse or faith word for every letter of the alphabet. Perfect for little learners and Sunday school classrooms.",
    href: "/resources/a-z-bible-verse-sheet.pdf",
  },
  {
    title: "Bedtime Prayer Cards",
    type: "Prayer",
    section: "Family Printables",
    description:
      "Short, tender prayers families can use before sleep or after story time.",
    href: "/resources/bedtime-prayer-cards.pdf",
  },
  {
    title: "Family Story Time Cards",
    type: "Story Time",
    section: "Family Printables",
    description:
      "Gentle discussion prompts that work with any book in the series.",
    href: "/resources/family-story-time-cards.pdf",
  },
  {
    title: "My Favorite Bible Story Activity Sheet",
    type: "Activity Sheet",
    section: "Family Printables",
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

const perBookResourceTypes: PerBookResourceType[] = [
  {
    type: "Activity Sheet",
    icon: "✏️",
    suffix: "activity-sheet",
    section: "Family Printables",
    groupLabel: "Per-Story Activity Sheets",
    titleTemplate: "{title} Activity Sheet",
    descriptionTemplate:
      "A printable draw-and-respond activity sheet for {title}. Children draw their favorite scene and answer simple questions about the story.",
  },
  {
    type: "Poster",
    icon: "🖼️",
    suffix: "verse-poster",
    section: "Memory Verse Posters",
    titleTemplate: "{title} Memory Verse Poster",
    descriptionTemplate:
      "A printable 5x7 memory verse poster from {title}. Display it in a bedroom, nursery, or classroom.",
  },
  {
    type: "Lesson Pack",
    icon: "📋",
    suffix: "lesson-pack",
    section: "Sunday School Lesson Packs",
    titleTemplate: "{title} Lesson Pack",
    descriptionTemplate:
      "A one-page Sunday school guide for {title} - includes a key verse, story summary, discussion questions, and a simple activity.",
  },
  {
    type: "Devotional",
    icon: "❤️",
    suffix: "devotional",
    section: "5-Day Family Devotionals",
    titleTemplate: "{title} 5-Day Devotional",
    descriptionTemplate:
      "A printable 5-day devotional for families using {title} - a short focus for each day of the week.",
  },
  {
    type: "Sequencing Cards",
    icon: "🃏",
    suffix: "sequencing-cards",
    section: "Story Sequencing Cards",
    titleTemplate: "{title} Sequencing Cards",
    descriptionTemplate:
      "Printable cut-out scene cards from {title}. Children arrange the cards in the correct story order - a hands-on activity for ages 3 to 6.",
  },
  {
    type: "Coloring Page",
    icon: "🎨",
    suffix: "coloring-page",
    previewSuffix: "coloring-page-preview",
    previewFolder: "/resources/previews/",
    section: "Coloring Pages",
    titleTemplate: "{title} Coloring Page",
    descriptionTemplate: "A printable coloring page from {title} artwork.",
  },
];

function fillTemplate(template: string, book: BookResourceMeta) {
  return template.replace(/{title}/g, book.title);
}

function generatePerBookResources(resourceType: PerBookResourceType) {
  return publishedBookResources.map((book) => ({
    title: fillTemplate(resourceType.titleTemplate, book),
    type: resourceType.type,
    icon: resourceType.icon,
    book: book.number,
    section: resourceType.section,
    groupLabel: resourceType.groupLabel,
    description: fillTemplate(resourceType.descriptionTemplate, book),
    href: `/resources/${book.resourceSlug}-${resourceType.suffix}.pdf`,
    previewSrc:
      resourceType.previewFolder && resourceType.previewSuffix
        ? `${resourceType.previewFolder}${book.resourceSlug}-${resourceType.previewSuffix}.png`
        : undefined,
    previewAlt:
      resourceType.previewFolder && resourceType.previewSuffix
        ? `Preview of ${book.title} coloring page`
        : undefined,
  }));
}

const perBookResourcesByType = Object.fromEntries(
  perBookResourceTypes.map((resourceType) => [
    resourceType.type,
    generatePerBookResources(resourceType),
  ])
) as Record<string, Resource[]>;

const bookmarkSet: Resource[] = [
  {
    title: "Bible Stories Bookmark Collection",
    type: "Bookmark",
    section: "Bookmark Set + Certificate",
    description:
      "A full set of printable cut-out bookmarks - one per book in the series. Each bookmark includes the book title and key verse.",
    href: "/resources/bible-stories-bookmark-collection.pdf",
  },
];

const certificate: Resource[] = [
  {
    title: "Bible Stories for Little Hearts Certificate of Completion",
    type: "Certificate",
    section: "Bookmark Set + Certificate",
    description:
      "A printable certificate for children who have read through the Bible Stories for Little Hearts series. Fill in their name and celebrate!",
    href: "/resources/bible-stories-certificate-of-completion.pdf",
  },
];

export const resources: Resource[] = [
  ...familyPrintables,
  ...perBookResourcesByType["Activity Sheet"],
  ...perBookResourcesByType["Poster"],
  ...perBookResourcesByType["Lesson Pack"],
  ...perBookResourcesByType["Devotional"],
  ...perBookResourcesByType["Sequencing Cards"],
  ...bookmarkSet,
  ...certificate,
  ...perBookResourcesByType["Coloring Page"],
];
