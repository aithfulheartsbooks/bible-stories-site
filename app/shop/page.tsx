import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";

export const metadata = {
  title: "Little Hearts Tees | Faithful Hearts Books",
  description: "Gentle Bible verse tees for little ones.",
  alternates: {
    canonical: "/shop",
  },
};

type Tee = {
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

const tees: Tee[] = [
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
    image: "/shop/02-star.png",
    alt: "Design preview of a children's tee with a smiling star and the words Let Your Light Shine, Matthew 5:16",
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

export default function ShopPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden font-body text-chestnut">
      <div className="scenery" />
      <div className="cloud animate-drift-slow h-[60px] w-[180px] top-[8%] left-[-200px]" />
      <div
        className="cloud animate-drift-long h-[45px] w-[140px] top-[18%] left-[-200px]"
        style={{ animationDelay: "-30s" }}
      />
      <div
        className="cloud animate-drift-medium h-[70px] w-[220px] top-[4%] left-[-200px]"
        style={{ animationDelay: "-60s" }}
      />

      <SiteNav />

      <section className="relative z-10 mx-auto max-w-[1400px] px-6 pb-16 pt-32">
        <div className="opacity-0 animate-fade-up mx-auto max-w-[700px] text-center">
          <h1 className="mb-3 font-display text-4xl font-bold text-chestnut sm:text-5xl">
            Little Hearts Tees
          </h1>
          <p className="text-base text-chestnut-soft sm:text-lg">
            Gentle Bible verse tees for little ones.
          </p>
          <p className="mt-2 text-sm font-semibold text-chestnut-soft">
            Faithful Hearts Books (Faith Rivers)
          </p>
          <div className="mb-8 mt-3 text-xl tracking-widest text-gold">
            {"\u2726 \u2726 \u2726"}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 min-[600px]:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
          {tees.map((tee, index) => {
            const isLive = Boolean(tee.amazonUrl);

            return (
              <article
                key={tee.name}
                className={
                  isLive
                    ? "opacity-0 animate-fade-up flex flex-col rounded-3xl border border-white/80 bg-cream/85 p-5 shadow-md backdrop-blur-md sm:p-6"
                    : "opacity-0 animate-fade-up flex flex-col rounded-3xl border-2 border-dashed border-terracotta/35 bg-cream/55 p-5 backdrop-blur-md sm:p-6"
                }
                style={{ animationDelay: `${0.15 + index * 0.08}s` }}
              >
                <div className="relative mb-6 aspect-[2/3] overflow-hidden rounded-2xl bg-cream-deep shadow-md">
                  <Image
                    src={tee.image}
                    alt={tee.alt}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 280px"
                    className="object-contain"
                    priority={index < 2}
                  />
                </div>

                <h2 className="mb-1.5 font-display text-2xl font-bold leading-tight text-chestnut">
                  {tee.name}
                </h2>
                <p className="font-display text-base italic text-chestnut-soft">
                  {tee.verse}
                </p>

                {tee.pair ? (
                  <p className="mt-3 text-sm text-chestnut-soft">
                    Pair it with{" "}
                    <Link
                      href={tee.pair.href}
                      className="font-semibold text-terracotta hover:underline"
                    >
                      {tee.pair.title}
                    </Link>
                  </p>
                ) : null}

                <div className="mt-auto pt-5">
                  {tee.amazonUrl ? (
                    <a
                      href={tee.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold text-cream shadow-md transition-all hover:scale-105 hover:bg-chestnut"
                    >
                      Shop on Amazon
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-chestnut-soft">
                      Coming soon
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
