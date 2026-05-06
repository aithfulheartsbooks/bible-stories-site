// =============================================================
// 📚 ADD A NEW BOOK: Just add a new object to the array below.
// =============================================================
// - status: "available" or "coming-soon"
// - amazonUrl: paste your Amazon product link
// - coverImage: path to cover photo in /public folder (e.g. "/covers/noah.png")
// - coverScene: "noah" | "david" | "moses" | "book-05" | "book-06" | "book-11" | "book-12" | "default" (fallback SVG)
// - slug: used for each book's SEO-friendly page URL
// =============================================================

export type Book = {
  number: string;
  slug: string;
  title: string;
  subtitle?: string;
  ageRange?: string;
  theme?: string;
  blurb?: string;
  amazonUrl?: string;
  status: "available" | "coming-soon";
  coverImage?: string;
  coverScene?:
    | "noah"
    | "david"
    | "moses"
    | "book-05"
    | "book-06"
    | "book-07"
    | "book-08"
    | "book-11"
    | "book-12"
    | "default";
};

export const books: Book[] = [
  {
    number: "Book 01",
    slug: "noah-and-gods-big-promise",
    title: "Noah and God's Big Promise",
    subtitle: "Bible Stories for Little Hearts",
    ageRange: "Ages 3–8",
    theme: "Trust",
    blurb:
      "When the rains came, Noah trusted God's plan. A warm story of faith, friendship with the animals, and the promise of the rainbow.",
    amazonUrl: "https://www.amazon.com/dp/B0GYHZ8P9S",
    status: "available",
    coverImage: "/covers/noah.png",
    coverScene: "noah",
  },
  {
    number: "Book 02",
    slug: "david-and-the-giant",
    title: "David and the Giant",
    subtitle: "A Little Shepherd with a Big Faith",
    ageRange: "Ages 3–8",
    theme: "Courage",
    blurb:
      "A young shepherd boy discovers that even when we feel small, God is bigger than every giant we face.",
    amazonUrl: "https://www.amazon.com/dp/B0GYNRCKQD",
    status: "available",
    coverImage: "/covers/david.png",
    coverScene: "david",
  },
  {
    number: "Book 03",
    slug: "moses-and-the-red-sea",
    title: "Moses and the Red Sea",
    subtitle: "A Brave Leader and a Big Way",
    ageRange: "Ages 3–8",
    theme: "Faith",
    blurb:
      "When the waters rise, Moses trusts God's plan. A brave story of faith, leadership, and the miracle that saved a nation.",
    amazonUrl: "https://www.amazon.com/dp/B0GZ43TKCK",
    status: "available",
    coverImage: "/covers/moses.png",
    coverScene: "moses",
  },
  {
    number: "Book 04",
    slug: "jonah-and-the-big-fish",
    title: "Jonah and the Big Fish",
    subtitle: "A Big Fish and a Second Chance",
    ageRange: "Ages 3–8",
    theme: "Obedience",
    blurb:
      "When Jonah runs from God's plan, he ends up in a big adventure. A playful story about obedience, second chances, and how God never gives up on us.",
    amazonUrl: "https://www.amazon.com/dp/B0GZDKNN5L",
    status: "available",
    coverImage: "/covers/jonah.png",
    coverScene: "default",
  },
  {
    number: "Book 05",
    slug: "daniel-and-the-lions",
    title: "Daniel and the Lions",
    subtitle: "A Brave Heart and a Faithful Prayer",
    ageRange: "Ages 3–8",
    theme: "Prayer",
    blurb:
      "When Daniel keeps praying to God, he is sent into a den of lions. A brave story about faith, prayer, and trusting God when we feel afraid.",
    amazonUrl: "https://www.amazon.com/dp/B0GZGFJTSL",
    status: "available",
    coverImage: "/covers/daniel.jpg",
    coverScene: "book-05",
  },
  {
    number: "Book 06",
    slug: "esther-the-brave-queen",
    title: "Esther the Brave Queen",
    subtitle: "A Courageous Heart and a Faithful Voice",
    ageRange: "Ages 3–8",
    theme: "Bravery",
    blurb:
      "Even when Esther felt small and afraid, she found the courage to speak up for others. A beautiful story about purpose, faith, and being chosen for such a time as this.",
    amazonUrl: "https://www.amazon.com/dp/B0GZK239VN",
    status: "available",
    coverImage: "/covers/esther.png",
    coverScene: "book-06",
  },
  {
    number: "Book 07",
    slug: "the-christmas-story",
    title: "The Christmas Story",
    subtitle: "God Comes Close in Love",
    ageRange: "Ages 3-8",
    theme: "Love",
    blurb:
      "A tender retelling of the night Jesus was born, filled with wonder, warmth, and the beautiful truth that God came close because He loves us.",
    amazonUrl: "https://www.amazon.com/dp/B0GZNQZQGX",
    status: "available",
    coverImage: "/covers/christmas.png",
    coverScene: "book-07",
  },
  {
    number: "Book 08",
    slug: "josephs-colorful-coat",
    title: "Joseph's Colorful Coat",
    subtitle: "God Turns Everything Around",
    ageRange: "Ages 3-8",
    theme: "Forgiveness",
    blurb:
      "Joseph's story shows little hearts how God can work through hard days, surprising turns, and brave forgiveness to bring good in the end.",
    amazonUrl: "https://www.amazon.com/dp/B0GZL3YG8L",
    status: "available",
    coverImage: "/covers/joseph.png",
    coverScene: "book-08",
  },
  {
    number: "Book 09",
    slug: "the-easter-story",
    title: "The Easter Story",
    subtitle: "God's Greatest Rescue",
    ageRange: "Ages 3-8",
    theme: "Hope",
    blurb:
      "A joyful retelling of Jesus' death and resurrection, helping little hearts understand God's greatest rescue with warmth, wonder, and hope.",
    amazonUrl: "https://www.amazon.com/dp/B0GZPY9RL1",
    status: "available",
    coverImage: "/covers/easter.png",
    coverScene: "default",
  },
  {
    number: "Book 10",
    slug: "ruth-and-naomi",
    title: "Ruth and Naomi",
    subtitle: "Where You Go, I Will Go",
    ageRange: "Ages 3-8",
    theme: "Loyal Love",
    blurb:
      "Walk with Ruth and Naomi through hard times and harvest fields as God weaves faithful love into His greatest plan, from Bethlehem to King David and to Jesus himself.",
    amazonUrl: "https://www.amazon.com/dp/B0GZQX7D3N",
    status: "available",
    coverImage: "/covers/ruth.png",
    coverScene: "default",
  },
  {
    number: "Book 11",
    slug: "book-11-coming-soon",
    title: "Coming Soon",
    subtitle: "Another story to discover",
    status: "coming-soon",
    coverScene: "book-11",
  },
  {
    number: "Book 12",
    slug: "book-12-coming-soon",
    title: "Coming Soon",
    subtitle: "Stay tuned for more",
    status: "coming-soon",
    coverScene: "book-12",
  },
];
