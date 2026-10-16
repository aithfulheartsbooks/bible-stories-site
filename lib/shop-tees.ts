export type Tee = {
  name: string;
  verse: string;
  image: string;
  alt: string;
  amazonUrl?: string;
  pair?: {
    href: string;
    title: string;
  };
};

export const tees: Tee[] = [
  {
    name: "Little Lamb of God",
    verse: "John 1:29",
    image: "/shop/little-lamb-of-god.jpg",
    alt: "White children's tee with a smiling lamb and the words Little Lamb of God, John 1:29",
    amazonUrl: "https://amzn.to/4euCw1V",
  },
  {
    name: "God Keeps His Promises",
    verse: "Genesis 9:13",
    image: "/shop/god-keeps-his-promises.jpg",
    alt: "Navy children's tee with a rainbow, a smiling cloud, and the words God Keeps His Promises, Genesis 9:13",
    amazonUrl: "https://amzn.to/4efQFjv",
    pair: {
      href: "/book/noah-and-gods-big-promise",
      title: "Noah and God's Big Promise",
    },
  },
  {
    name: "Let Your Light Shine",
    verse: "Matthew 5:16",
    image: "/shop/let-your-light-shine.jpg",
    alt: "Pink children's tee with a smiling star and the words Let Your Light Shine, Matthew 5:16",
    amazonUrl: "https://amzn.to/3UvEoAQ",
  },
  {
    name: "Jesus Loves Me",
    verse: "John 15:9",
    image: "/shop/03-bunny.png",
    alt: "Design preview of a children's tee with a bunny and the words Jesus Loves Me, John 15:9",
  },
  {
    name: "Fearfully and Wonderfully Made",
    verse: "Psalm 139:14",
    image: "/shop/04-bear.png",
    alt: "Design preview of a children's tee with a bear and the words Fearfully and Wonderfully Made, Psalm 139:14",
  },
  {
    name: "The Lord Is My Shepherd",
    verse: "Psalm 23:1",
    image: "/shop/05-shepherd.png",
    alt: "Design preview of a children's tee with a shepherd and the words The Lord Is My Shepherd, Psalm 23:1",
    pair: {
      href: "/book/david-and-the-giant",
      title: "David and the Giant",
    },
  },
  {
    name: "Two by Two",
    verse: "Genesis 7:9",
    image: "/shop/06-ark.png",
    alt: "Design preview of a children's tee with an ark and the words Two by Two, Genesis 7:9",
    pair: {
      href: "/book/noah-and-gods-big-promise",
      title: "Noah and God's Big Promise",
    },
  },
  {
    name: "God Is With Me",
    verse: "Joshua 1:9",
    image: "/shop/07-lion.png",
    alt: "Design preview of a children's tee with a lion and the words God Is With Me, Joshua 1:9",
    pair: {
      href: "/book/joshua-and-jericho",
      title: "Joshua and Jericho",
    },
  },
  {
    name: "Joyful Heart",
    verse: "Proverbs 17:22",
    image: "/shop/08-sunflower.png",
    alt: "Design preview of a children's tee with a sunflower and the words Joyful Heart, Proverbs 17:22",
  },
  {
    name: "Be Kind",
    verse: "Ephesians 4:32",
    image: "/shop/09-fox.png",
    alt: "Design preview of a children's tee with a fox and the words Be Kind, Ephesians 4:32",
  },
];

export function formatLiveTeeList(items: readonly Tee[] = tees): string {
  const labels = items
    .filter((tee) => Boolean(tee.amazonUrl))
    .map((tee) => `${tee.name} (${tee.verse})`);

  if (labels.length <= 1) return labels[0] ?? "";
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
}
