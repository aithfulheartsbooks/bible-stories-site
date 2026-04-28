// =============================================================
// 📚 ADD A NEW BOOK: Just add a new object to the array below.
// =============================================================
// - status: "available" or "coming-soon"
// - amazonUrl: paste your Amazon product link
// - coverScene: "noah" | "david" | "moses" | "default"
//   (You can add new scenes in components/BookCovers.tsx)
// =============================================================

export type Book = {
  number: string;
  title: string;
  subtitle?: string;
  ageRange?: string;
  theme?: string;
  blurb?: string;
  amazonUrl?: string;
  status: "available" | "coming-soon";
  coverScene?: "noah" | "david" | "moses" | "default";
};

export const books: Book[] = [
  {
    number: "Book 01",
    title: "Noah and God's Big Promise",
    subtitle: "Bible Stories for Little Hearts",
    ageRange: "Ages 3–8",
    theme: "Trust",
    blurb:
      "When the rains came, Noah trusted God's plan. A warm story of faith, friendship with the animals, and the promise of the rainbow.",
    amazonUrl: "https://www.amazon.com/dp/B0GYHZ8P9S",
    status: "available",
    coverScene: "noah",
  },
  {
    number: "Book 02",
    title: "David and the Giant",
    subtitle: "A Little Shepherd with a Big Faith",
    ageRange: "Ages 3–8",
    theme: "Courage",
    blurb:
      "A young shepherd boy discovers that even when we feel small, God is bigger than every giant we face.",
    amazonUrl: "https://www.amazon.com/dp/B0GYNRCKQD",
    status: "available",
    coverScene: "david",
  },
  {
    number: "Book 03",
    title: "Moses and the Red Sea",
    subtitle: "A Brave Leader and a Big Way",
    status: "coming-soon",
  },
  {
    number: "Book 04",
    title: "Coming Soon",
    subtitle: "A new adventure is on the way",
    status: "coming-soon",
  },
  {
    number: "Book 05",
    title: "Coming Soon",
    subtitle: "Another story to discover",
    status: "coming-soon",
  },
  {
    number: "Book 06",
    title: "Coming Soon",
    subtitle: "Stay tuned for more",
    status: "coming-soon",
  },
];
