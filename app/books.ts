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
  song?: {
    title: string;
    artist: string;
    embedId: string;
  };
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

const PLANNED_BOOK_COUNT = 36;

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
    ageRange: "Ages 3-8",
    theme: "Trust",
    blurb:
      "When the rains came, Noah trusted God's plan. A warm story of faith, friendship with the animals, and the promise of the rainbow.",
    amazonUrl: "https://www.amazon.com/dp/B0GYHZ8P9S",
    scriptureReference: "Genesis 6-9",
    biblicalOrder: 20,
    status: "available",
    coverImage: "/covers/noah.png",
    song: {
      title: "Rise and Shine (Arky Arky)",
      artist: "Cedarmont Kids",
      embedId: "56QWeYtHW0k",
    },
    coverScene: "noah",
  },
  {
    number: "Book 02",
    slug: "david-and-the-giant",
    title: "David and the Giant",
    subtitle: "A Little Shepherd with a Big Faith",
    ageRange: "Ages 3-8",
    theme: "Courage",
    blurb:
      "A young shepherd boy discovers that even when we feel small, God is bigger than every giant we face.",
    amazonUrl: "https://www.amazon.com/dp/B0GYNRCKQD",
    scriptureReference: "1 Samuel 17",
    biblicalOrder: 70,
    status: "available",
    coverImage: "/covers/david.png",
    song: {
      title: "David and Goliath",
      artist: "Bible Songs for Kids",
      embedId: "m1SHCJ44fDo",
    },
    coverScene: "david",
  },
  {
    number: "Book 03",
    slug: "moses-and-the-red-sea",
    title: "Moses and the Red Sea",
    subtitle: "A Brave Leader and a Big Way",
    ageRange: "Ages 3-8",
    theme: "Faith",
    blurb:
      "When the waters rise, Moses trusts God's plan. A brave story of faith, leadership, and the miracle that saved a nation.",
    amazonUrl: "https://www.amazon.com/dp/B0GZ43TKCK",
    scriptureReference: "Exodus 14",
    biblicalOrder: 50,
    status: "available",
    coverImage: "/covers/moses.png",
    song: {
      title: "God Parts the Red Sea",
      artist: "Bible Songs for Kids",
      embedId: "LxRTl4v060g",
    },
    coverScene: "moses",
  },
  {
    number: "Book 04",
    slug: "jonah-and-the-big-fish",
    title: "Jonah and the Big Fish",
    subtitle: "A Big Fish and a Second Chance",
    ageRange: "Ages 3-8",
    theme: "Obedience",
    blurb:
      "When Jonah runs from God's plan, he ends up in a big adventure. A playful story about obedience, second chances, and how God never gives up on us.",
    amazonUrl: "https://www.amazon.com/dp/B0GZDKNN5L",
    scriptureReference: "Book of Jonah",
    biblicalOrder: 120,
    status: "available",
    coverImage: "/covers/jonah.png",
    song: {
      title: "Who Did Swallow Jonah?",
      artist: "Sing Hosanna",
      embedId: "3ze-RgXHYVE",
    },
    coverScene: "default",
  },
  {
    number: "Book 05",
    slug: "daniel-and-the-lions",
    title: "Daniel and the Lions",
    subtitle: "A Brave Heart and a Faithful Prayer",
    ageRange: "Ages 3-8",
    theme: "Prayer",
    blurb:
      "When Daniel keeps praying to God, he is sent into a den of lions. A brave story about faith, prayer, and trusting God when we feel afraid.",
    amazonUrl: "https://www.amazon.com/dp/B0GZGFJTSL",
    scriptureReference: "Daniel 6",
    biblicalOrder: 110,
    status: "available",
    coverImage: "/covers/daniel.jpg",
    song: {
      title: "Dare to Be a Daniel",
      artist: "Kids Bible Song",
      embedId: "3k7wqHUpJOI",
    },
    coverScene: "book-05",
  },
  {
    number: "Book 06",
    slug: "esther-the-brave-queen",
    title: "Esther the Brave Queen",
    subtitle: "A Courageous Heart and a Faithful Voice",
    ageRange: "Ages 3-8",
    theme: "Bravery",
    blurb:
      "Even when Esther felt small and afraid, she found the courage to speak up for others. A beautiful story about purpose, faith, and being chosen for such a time as this.",
    amazonUrl: "https://www.amazon.com/dp/B0GZK239VN",
    scriptureReference: "Book of Esther",
    biblicalOrder: 100,
    status: "available",
    coverImage: "/covers/esther.png",
    song: {
      title: "Esther Brave Queen",
      artist: "GOKidzAsia",
      embedId: "0cRs9Abigds",
    },
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
    song: {
      title: "Away in a Manger",
      artist: "CJ and Friends",
      embedId: "oWek4spZKog",
    },
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
    song: {
      title: "Coat of Many Colors",
      artist: "Animated Bible Song",
      embedId: "j5dkKAuPQ40",
    },
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
    song: {
      title: "He Is Risen",
      artist: "Kids Bible Song",
      embedId: "9WAPwB-PEno",
    },
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
    song: {
      title: "A Song about Ruth and Naomi",
      artist: "Children's Bible Songs",
      embedId: "SKDaYeXlsEE",
    },
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
    song: {
      title: "Baby Moses in the Basket",
      artist: "Kids Christian Song",
      embedId: "mSEwseXkNtU",
    },
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
    song: {
      title: "Solomon - Animated with Lyrics",
      artist: "DG Bible Songs",
      embedId: "9ms3BYHIHgI",
    },
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
    song: {
      title: "Elijah and the Still Small Voice",
      artist: "Latter Day Kids",
      embedId: "Gcw36BTFzQQ",
    },
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
    song: {
      title: "Jesus Calms the Storm",
      artist: "Children's Song",
      embedId: "XIF9aREye6o",
    },
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
    song: {
      title: "Days of Creation",
      artist: "Christian Songs for Kids",
      embedId: "9qG0-XB-I54",
    },
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
    song: {
      title: "I'm in the Lord's Army",
      artist: "Cedarmont Kids",
      embedId: "nJoB5XCQ5gs",
    },
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
    song: {
      title: "Zacchaeus - Animated Sing-Along",
      artist: "Kids Bible Song",
      embedId: "X0ABM9xh9eE",
    },
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
    song: {
      title: "Love Your Neighbor",
      artist: "DG Bible Songs",
      embedId: "vtMRN4FV1fs",
    },
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
    song: {
      title: "The Lost Sheep - Animated",
      artist: "DG Bible Songs",
      embedId: "Epxh68WKiiw",
    },
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
    song: {
      title: "5 Loaves and 2 Fish - Animated",
      artist: "DG Bible Songs",
      embedId: "sqgVKfFoKVk",
    },
    coverScene: "default",
  },
  {
    number: "Book 21",
    slug: "adam-and-eve-in-the-garden",
    title: "Adam and Eve in the Garden",
    subtitle: "God's Beautiful Beginning",
    ageRange: "Ages 3-8",
    theme: "Wonder",
    blurb:
      "A gentle garden story about God's beautiful beginning, the first family, and the loving care He showed from the very start.",
    amazonUrl: "https://www.amazon.com/dp/B0H1JDBH3V",
    scriptureReference: "Genesis 2-3",
    biblicalOrder: 15,
    status: "available",
    coverImage: "/covers/adam-and-eve-in-the-garden.jpg",
    song: {
      title: "Adam and Eve",
      artist: "Shawna Edwards",
      embedId: "UWHrOWAeAHs",
    },
    coverScene: "default",
  },
  {
    number: "Book 22",
    slug: "joshua-and-jericho",
    title: "Joshua and Jericho",
    subtitle: "When God Makes the Walls Fall",
    ageRange: "Ages 3-8",
    theme: "Faith",
    blurb:
      "A joyful story of Joshua, a brave people, and the day God brought Jericho's walls down after they trusted and obeyed.",
    amazonUrl: "https://www.amazon.com/dp/B0H25YF2J6",
    scriptureReference: "Joshua 6",
    biblicalOrder: 55,
    status: "available",
    coverImage: "/covers/joshua-and-jericho.jpg",
    song: {
      title: "Joshua Fought the Battle of Jericho!",
      artist: "Good News Guys",
      embedId: "iznTwRZloQM",
    },
    coverScene: "default",
  },
  {
    number: "Book 23",
    slug: "the-fiery-furnace",
    title: "The Fiery Furnace",
    subtitle: "God Is With Us in the Fire",
    ageRange: "Ages 3-8",
    theme: "Courage",
    blurb:
      "Shadrach, Meshach, and Abednego choose to trust God, even in the fiery furnace, and discover they are never alone.",
    amazonUrl: "https://www.amazon.com/dp/B0H25KF241",
    scriptureReference: "Daniel 3",
    biblicalOrder: 112,
    status: "available",
    coverImage: "/covers/the-fiery-furnace.jpg",
    song: {
      title: "Not Afraid of the Fire",
      artist: "JoyfulJams TV",
      embedId: "wTQVEnKX7LE",
    },
    coverScene: "default",
  },
  {
    number: "Book 24",
    slug: "the-prodigal-son",
    title: "The Prodigal Son",
    subtitle: "A Father Runs to Forgive",
    ageRange: "Ages 3-8",
    theme: "Forgiveness",
    blurb:
      "A tender parable about a son who comes home and a loving father who runs to welcome him with forgiveness and joy.",
    amazonUrl: "https://www.amazon.com/dp/B0H25RMCJY",
    scriptureReference: "Luke 15:11-32",
    biblicalOrder: 146,
    status: "available",
    coverImage: "/covers/the-prodigal-son.jpg",
    song: {
      title: "But Hey (Story of the Prodigal Son's Elder Brother)",
      artist: "DG Bible Songs",
      embedId: "SjdObquzlhA",
    },
    coverScene: "default",
  },
  {
    number: "Book 25",
    slug: "jesus-welcomes-children",
    title: "Jesus Welcomes Children",
    subtitle: "Let the Little Children Come",
    ageRange: "Ages 3-8",
    theme: "Love",
    blurb:
      "A warm Gospel story reminding little hearts that Jesus sees children, welcomes them close, and blesses them with love.",
    amazonUrl: "https://www.amazon.com/dp/B0H25YPF38",
    scriptureReference: "Mark 10:13-16",
    biblicalOrder: 143,
    status: "available",
    coverImage: "/covers/jesus-welcomes-children.jpg",
    song: {
      title: "Let The Little Children Come",
      artist: "Twin Sisters - Songs & Stories For Kids",
      embedId: "Mp23IHKKsSQ",
    },
    coverScene: "default",
  },
  {
    number: "Book 26",
    slug: "the-wedding-at-cana",
    title: "The Wedding at Cana",
    subtitle: "When Jesus Brings the Best",
    ageRange: "Ages 3-8",
    theme: "Wonder",
    blurb:
      "A joyful first-miracle story where Jesus cares about an ordinary celebration and fills empty jars with the very best.",
    amazonUrl: "https://www.amazon.com/dp/B0H26G965M",
    scriptureReference: "John 2:1-11",
    biblicalOrder: 135,
    status: "available",
    coverImage: "/covers/the-wedding-at-cana.jpg",
    song: {
      title: "I'm Gonna Jump Up and Down",
      artist: "Long Crendon Baptist Church",
      embedId: "juoTBFksrWY",
    },
    coverScene: "default",
  },
  {
    number: "Book 27",
    slug: "hannahs-prayer-and-young-samuel",
    title: "Hannah's Prayer and Young Samuel",
    subtitle: "God Hears the Smallest Voice",
    ageRange: "Ages 3-8",
    theme: "Prayer",
    blurb:
      "A tender story of honest prayer, a long-awaited gift, and young Samuel learning to listen when God calls his name.",
    amazonUrl: "https://www.amazon.com/dp/B0H26QR9MJ",
    scriptureReference: "1 Samuel 1:1-28; 2:1-11; 3:1-10",
    biblicalOrder: 65,
    status: "available",
    coverImage: "/covers/hannahs-prayer-and-young-samuel.jpg",
    song: {
      title: "Here I Am, Lord",
      artist: "KaraokeCatolica",
      embedId: "e7IC8SpLk6k",
    },
    coverScene: "default",
  },
  {
    number: "Book 28",
    slug: "saul-becomes-paul",
    title: "Saul Becomes Paul",
    subtitle: "When Jesus Changes Everything",
    ageRange: "Ages 3-8",
    theme: "Forgiveness",
    blurb:
      "A bright Damascus-road story showing little hearts that Jesus can change anyone and make every heart new.",
    amazonUrl: "https://www.amazon.com/dp/B0H26XYBCM",
    scriptureReference: "Acts 9:1-19; 22:6-16; 26:12-18",
    biblicalOrder: 155,
    status: "available",
    coverImage: "/covers/saul-becomes-paul.jpg",
    song: {
      title: "Paul's Ministry",
      artist: "Saddleback Kids",
      embedId: "IlXFy3zjJh4",
    },
    coverScene: "default",
  },
  {
    number: "Book 29",
    slug: "paul-and-silas-in-prison",
    title: "Paul and Silas in Prison",
    subtitle: "Songs in the Dark",
    ageRange: "Ages 3-8",
    theme: "Courage",
    blurb:
      "An exciting Acts story about choosing joy in hard places, singing at midnight, and seeing God open doors.",
    amazonUrl: "https://www.amazon.com/dp/B0H274YJR4",
    scriptureReference: "Acts 16:16-40",
    biblicalOrder: 156,
    status: "available",
    coverImage: "/covers/paul-and-silas-in-prison.jpg",
    song: {
      title: "Paul & Silas' Joyful Faith",
      artist: "Little Disciples",
      embedId: "JAdf94ujIsI",
    },
    coverScene: "default",
  },
  {
    number: "Book 30",
    slug: "pentecost-the-holy-spirit-comes",
    title: "Pentecost: The Holy Spirit Comes",
    subtitle: "Power and Joy and the Spirit of God",
    ageRange: "Ages 3-8",
    theme: "Faith",
    blurb:
      "A joyful Pentecost story showing little hearts that Jesus sent the Holy Spirit, our Helper, so we are never alone.",
    amazonUrl: "https://www.amazon.com/dp/B0H2F78SY9",
    scriptureReference: "Acts 1:4-8; 2:1-41",
    biblicalOrder: 152,
    status: "available",
    coverImage: "/covers/pentecost-the-holy-spirit-comes.jpg",
    song: {
      title: "Holy Spirit, Give Us Power to Share Jesus Every Hour",
      artist: "Trueway Kids",
      embedId: "WEYX6V4achc",
    },
    coverScene: "default",
  },
  {
    number: "Book 31",
    slug: "elisha-and-the-widows-oil",
    title: "Elisha and the Widow's Oil",
    subtitle: "God Fills Every Empty Jar",
    ageRange: "Ages 3-8",
    theme: "Trust",
    blurb:
      "A warm story of God's provision, showing little hearts that when we bring what we have and trust Him, He can fill every empty place.",
    amazonUrl: "https://www.amazon.com/dp/B0H2Z7SP3B",
    scriptureReference: "2 Kings 4:1-7",
    biblicalOrder: 92,
    status: "available",
    coverImage: "/covers/elisha-and-the-widows-oil.jpg",
    song: {
      title: "Elisha and the Widow's Oil",
      artist: "Kids on the Move",
      embedId: "eASKEdmxwf8",
    },
    coverScene: "default",
  },
  {
    number: "Book 32",
    slug: "tower-of-babel",
    title: "Tower of Babel",
    subtitle: "God Knows Best, Even When We Don't Understand",
    ageRange: "Ages 3-8",
    theme: "Trust",
    blurb:
      "A thoughtful Genesis story reminding little hearts that when people forget God, plans can fall apart, but God still leads us with love.",
    amazonUrl: "https://www.amazon.com/dp/B0H344KNV1",
    scriptureReference: "Genesis 11:1-9",
    biblicalOrder: 25,
    status: "available",
    coverImage: "/covers/tower-of-babel.jpg",
    song: {
      title: "The Tower of Babel",
      artist: "Crawl Walk Shuffle",
      embedId: "sHJKzUStohs",
    },
    coverScene: "default",
  },
  {
    number: "Book 33",
    slug: "gideons-tiny-army",
    title: "Gideon's Tiny Army",
    subtitle: "When God Is on Your Side, You Are Enough",
    ageRange: "Ages 3-8",
    theme: "Courage",
    blurb:
      "A brave Judges story showing little hearts that God can use the small and weak to do mighty things.",
    amazonUrl: "https://www.amazon.com/dp/B0H373C86F",
    scriptureReference: "Judges 6-7",
    biblicalOrder: 58,
    status: "available",
    coverImage: "/covers/gideons-tiny-army.jpg",
    song: {
      title: "Gideon's Tiny Army?!",
      artist: "Murphix Plus Kids",
      embedId: "d-V6xhhQHQc",
    },
    coverScene: "default",
  },
  {
    number: "Book 34",
    slug: "nehemiah-builds-the-wall",
    title: "Nehemiah Builds the Wall",
    subtitle: "Pray, Plan, and Work",
    ageRange: "Ages 3-8",
    theme: "Faith",
    blurb:
      "A steady story about praying first, planning carefully, working with courage, and trusting God to help us finish what matters.",
    amazonUrl: "https://www.amazon.com/dp/B0H3F92CBF",
    scriptureReference: "Nehemiah 1-6",
    biblicalOrder: 125,
    status: "available",
    coverImage: "/covers/nehemiah-builds-the-wall.jpg",
    song: {
      title: "Nehemiah Built the Wall",
      artist: "Judah's Tribe",
      embedId: "quCo46OFBe8",
    },
    coverScene: "default",
  },
  {
    number: "Book 35",
    slug: "jesus-walks-on-water",
    title: "Jesus Walks on Water",
    subtitle: "Keep Your Eyes on Jesus",
    ageRange: "Ages 3-8",
    theme: "Faith",
    blurb:
      "A faith-filled Gospel story reminding little hearts that when we feel like we are sinking, Jesus reaches out His hand.",
    amazonUrl: "https://www.amazon.com/dp/B0H3FNVRM5",
    scriptureReference: "Matthew 14:22-33",
    biblicalOrder: 142.5,
    status: "available",
    coverImage: "/covers/jesus-walks-on-water.jpg",
    song: {
      title: "Jesus Walks on Water",
      artist: "Kids Faith TV",
      embedId: "q8HQGsAHfmg",
    },
    coverScene: "default",
  },
  {
    number: "Book 36",
    slug: "lazarus-comes-out",
    title: "Lazarus Comes Out",
    subtitle: "With Jesus, There Is Always Hope",
    ageRange: "Ages 3-8",
    theme: "Hope",
    blurb:
      "A tender John 11 story showing that Jesus cares about our tears and that with Him, there is always hope.",
    amazonUrl: "https://www.amazon.com/dp/B0H3FKBSMF",
    scriptureReference: "John 11:1-44",
    biblicalOrder: 149,
    status: "available",
    coverImage: "/covers/lazarus-comes-out.jpg",
    song: {
      title: "Lazarus",
      artist: "DG Bible Songs",
      embedId: "3Fl3QaZUwSc",
    },
    coverScene: "default",
  },
];

export const books: Book[] = [
  ...publishedBooks,
  ...createComingSoonBooks(publishedBooks.length + 1, PLANNED_BOOK_COUNT),
];
