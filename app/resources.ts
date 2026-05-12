export type Resource = {
  title: string;
  type: string;
  book?: string;
  description: string;
  href: string;
};

export const resources: Resource[] = [
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
  {
    title: "The Creation Story Coloring Page",
    type: "Coloring Page",
    book: "Book 15",
    description:
      "A printable coloring page from The Creation Story artwork.",
    href: "/resources/the-creation-story-coloring-page.pdf",
  },
  {
    title: "The Armor of God Coloring Page",
    type: "Coloring Page",
    book: "Book 16",
    description:
      "A printable coloring page from The Armor of God artwork.",
    href: "/resources/the-armor-of-god-coloring-page.pdf",
  },
  {
    title: "Zacchaeus Coloring Page",
    type: "Coloring Page",
    book: "Book 17",
    description: "A printable coloring page from Zacchaeus artwork.",
    href: "/resources/zacchaeus-coloring-page.pdf",
  },
  {
    title: "The Good Samaritan Coloring Page",
    type: "Coloring Page",
    book: "Book 18",
    description:
      "A printable coloring page from The Good Samaritan artwork.",
    href: "/resources/the-good-samaritan-coloring-page.pdf",
  },
  {
    title: "The Lost Sheep Coloring Page",
    type: "Coloring Page",
    book: "Book 19",
    description:
      "A peaceful printable coloring page made from The Lost Sheep artwork.",
    href: "/resources/the-lost-sheep-coloring-page.pdf",
  },
  {
    title: "Feeding the 5000 Coloring Page",
    type: "Coloring Page",
    book: "Book 20",
    description:
      "A printable coloring page from Feeding the 5000 artwork.",
    href: "/resources/feeding-the-5000-coloring-page.pdf",
  },
  {
    title: "Adam and Eve Coloring Page",
    type: "Coloring Page",
    book: "Book 21",
    description: "A printable coloring page from Adam and Eve artwork.",
    href: "/resources/adam-and-eve-coloring-page.pdf",
  },
];
