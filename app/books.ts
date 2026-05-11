// =============================================================
// 📚 ADD A NEW BOOK: Just add a new object to the array below.
// =============================================================
// - status: "available" or "coming-soon"
// - amazonUrl: paste your Amazon product link
// - coverImage: path to cover photo in /public folder (e.g. "/covers/noah.png")
// - coverScene: "noah" | "david" | "moses" | "book-05" | "book-06" | "book-11" | "book-12" | "default" (fallback SVG)
// - slug: used for each book's SEO-friendly page URL
// - scriptureReference: Bible passage shown on the Series Map
// - biblicalOrder: optional exact Series Map position for biblical chronology
// - PLANNED_BOOK_COUNT controls how many future slots appear on the homepage.
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
  scriptureReference?: string;
  biblicalOrder?: number;
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
    | "book-13"
    | "book-14"
    | "book-15"
    | "default";
};

const PLANNED_BOOK_COUNT = 20;

function formatBookNumber(number: number) {
  return `Book ${String(number).padStart(2, "0")}`;
}

function createComingSoonBooks(start: number, end: number): Book[] {
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => {
    const bookNumber = start + index;

    return {
      number: formatBookNumber(bookNumber),
      slug: `book-${bookNumber}-coming-soon`,
      title: "Coming Soon",
      subtitle: "Stay tuned for more",
      status: "coming-soon" as const,
      coverScene: "default" as const,
    };
  });
}

const publishedBooks: Book[] = [
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
    scriptureReference: "Genesis 6-9",
    biblicalOrder: 20,
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
    scriptureReference: "1 Samuel 17",
    biblicalOrder: 70,
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
    scriptureReference: "Exodus 14",
    biblicalOrder: 50,
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
    scriptureReference: "Book of Jonah",
    biblicalOrder: 120,
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
    scriptureReference: "Daniel 6",
    biblicalOrder: 110,
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
    scriptureReference: "Book of Esther",
    biblicalOrder: 100,
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
    scriptureReference: "Luke 2",
    biblicalOrder: 130,
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
    scriptureReference: "Genesis 37-50",
    biblicalOrder: 30,
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
    scriptureReference: "Matthew 28",
    biblicalOrder: 150,
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
    scriptureReference: "Book of Ruth",
    biblicalOrder: 60,
    status: "available",
    coverImage: "/covers/ruth.png",
    coverScene: "default",
  },
  {
    number: "Book 11",
    slug: "the-birth-of-moses",
    title: "The Birth of Moses",
    subtitle: "God Protects From the Beginning",
    ageRange: "Ages 3-8",
    theme: "Protection",
    blurb:
      "A mother's love, a brave big sister, and a tiny basket on the Nile show little hearts how God protects His children from the very beginning.",
    amazonUrl: "https://www.amazon.com/dp/B0H15BN3RD",
    scriptureReference: "Exodus 1-2",
    biblicalOrder: 40,
    status: "available",
    coverImage: "/covers/birth-of-moses.jpg",
    coverScene: "book-11",
  },
  {
    number: "Book 12",
    slug: "solomon-and-wisdom",
    title: "Solomon and Wisdom",
    subtitle: "Ask God for Wisdom",
    ageRange: "Ages 3-8",
    theme: "Wisdom",
    blurb:
      "When God told Solomon he could ask for anything, Solomon chose wisdom. A thoughtful story about listening hearts, wise choices, and asking God for help every day.",
    amazonUrl: "https://www.amazon.com/dp/B0H184LKSF",
    scriptureReference: "1 Kings 3",
    biblicalOrder: 80,
    status: "available",
    coverImage: "/covers/solomon-and-wisdom.jpg",
    coverScene: "book-12",
  },
  {
    number: "Book 13",
    slug: "elijah-and-the-still-small-voice",
    title: "Elijah and the Still Small Voice",
    subtitle: "God Speaks in the Quiet",
    ageRange: "Ages 3-8",
    theme: "Listening",
    blurb:
      "Elijah was brave and faithful, but even brave people can feel tired and afraid. A comforting story about hearing God's gentle voice in quiet moments.",
    amazonUrl: "https://www.amazon.com/dp/B0H18JDFCW",
    scriptureReference: "1 Kings 19",
    biblicalOrder: 90,
    status: "available",
    coverImage: "/covers/elijah-still-small-voice.jpg",
    coverScene: "book-13",
  },
  {
    number: "Book 14",
    slug: "jesus-calms-the-storm",
    title: "Jesus Calms the Storm",
    subtitle: "Peace, Be Still",
    ageRange: "Ages 3-8",
    theme: "Peace",
    blurb:
      "When the wind howled and the waves rose high, Jesus was right there in the boat. A comforting story that reminds little hearts Jesus is near in every storm.",
    amazonUrl: "https://www.amazon.com/dp/B0H18WDG5P",
    scriptureReference: "Mark 4",
    biblicalOrder: 140,
    status: "available",
    coverImage: "/covers/jesus-calms-the-storm.jpg",
    coverScene: "book-14",
  },
  {
    number: "Book 15",
    slug: "the-creation-story",
    title: "The Creation Story",
    subtitle: "God Made Everything",
    ageRange: "Ages 3-8",
    theme: "Wonder",
    blurb:
      "A joyful retelling of Genesis 1 that helps little hearts see the beauty of God's world, from light and sky to animals, people, and rest.",
    amazonUrl: "https://www.amazon.com/dp/B0H18HQKWT",
    scriptureReference: "Genesis 1",
    biblicalOrder: 10,
    status: "available",
    coverImage: "/covers/the-creation-story.jpg",
    coverScene: "book-15",
  },
  {
    number: "Book 16",
    slug: "the-armor-of-god",
    title: "The Armor of God",
    subtitle: "Dressed for God's Adventure",
    ageRange: "Ages 3-8",
    theme: "Faith",
    blurb:
      "A joyful story from Ephesians 6 that helps little hearts remember God gives us truth, righteousness, peace, faith, salvation, and His Word for every adventure.",
    amazonUrl: "https://www.amazon.com/dp/B0H1BQX3LP",
    scriptureReference: "Ephesians 6:10-18",
    biblicalOrder: 160,
    status: "available",
    coverImage: "/covers/armor-of-god.jpg",
    coverScene: "default",
  },
  {
    number: "Book 17",
    slug: "zacchaeus",
    title: "Zacchaeus",
    subtitle: "Jesus Loves Everyone - Even Me!",
    ageRange: "Ages 3-8",
    theme: "Love",
    blurb:
      "A warm, joyful retelling of the little man in the tree, reminding children that Jesus sees every heart and His love can change everything.",
    amazonUrl: "https://www.amazon.com/dp/B0H1CG1P1X",
    scriptureReference: "Luke 19:1-10",
    biblicalOrder: 148,
    status: "available",
    coverImage: "/covers/zacchaeus.jpg",
    coverScene: "default",
  },
  {
    number: "Book 18",
    slug: "the-good-samaritan",
    title: "The Good Samaritan",
    subtitle: "Love Your Neighbour",
    ageRange: "Ages 3-8",
    theme: "Love",
    blurb:
      "Jesus' parable of a kind helper on the Jericho road teaches little hearts to love their neighbour with compassion, courage, and care.",
    amazonUrl: "https://www.amazon.com/dp/B0H1CPYC6T",
    scriptureReference: "Luke 10:25-37",
    biblicalOrder: 145,
    status: "available",
    coverImage: "/covers/the-good-samaritan.jpg",
    coverScene: "default",
  },
  {
    number: "Book 19",
    slug: "the-lost-sheep",
    title: "The Lost Sheep",
    subtitle: "Jesus Comes to Find You",
    ageRange: "Ages 3-8",
    theme: "Love",
    blurb:
      "A tender story of the shepherd who searches until he finds the one lost sheep, reminding little hearts that Jesus knows them by name and never gives up.",
    amazonUrl: "https://www.amazon.com/dp/B0H1CTPVMV",
    scriptureReference: "Luke 15:3-7; Matthew 18:12-14",
    biblicalOrder: 147,
    status: "available",
    coverImage: "/covers/the-lost-sheep.jpg",
    coverScene: "default",
  },
  {
    number: "Book 20",
    slug: "the-feeding-of-the-5000",
    title: "The Feeding of the 5,000",
    subtitle: "Jesus Has More Than Enough",
    ageRange: "Ages 3-8",
    theme: "Faith",
    blurb:
      "A sunlit miracle story about a small lunch, a willing child, and Jesus making more than enough for everyone on the hillside.",
    amazonUrl: "https://www.amazon.com/dp/B0H1D867ZJ",
    scriptureReference:
      "Mark 6:30-44; John 6:1-14; Matthew 14:13-21; Luke 9:10-17",
    biblicalOrder: 142,
    status: "available",
    coverImage: "/covers/feeding-the-5000.jpg",
    coverScene: "default",
  },
];

export const books: Book[] = [
  ...publishedBooks,
  ...createComingSoonBooks(publishedBooks.length + 1, PLANNED_BOOK_COUNT),
];
