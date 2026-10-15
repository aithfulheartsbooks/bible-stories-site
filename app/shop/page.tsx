import Image from "next/image";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";

export const metadata = {
  title: "Little Hearts Tees | Faithful Hearts Books",
  description:
    "Gentle Bible verse tees for little ones, by Faith Rivers.",
  alternates: {
    canonical: "/shop",
  },
};

type Tee = {
  title: string;
  verse: string;
  image: string;
  alt: string;
  amazonUrl?: string;
  pairWith?: {
    href: string;
    title: string;
  };
};

const tees: Tee[] = [
  {
    title: "Little Lamb of God",
    verse: "John 1:29",
    image: "/shop/little-lamb-of-god.jpg",
    alt: "White children's tee printed with a little lamb and the words Little Lamb of God, John 1:29",
    amazonUrl: "https://amzn.to/4dFrdnq",
  },
  {
    title: "God Keeps His Promises",
    verse: "Genesis 9:13",
    image: "/shop/god-keeps-his-promises.webp",
    alt: "White children's tee printed with a rainbow and the words God Keeps His Promises, Genesis 9:13",
    amazonUrl: "https://amzn.to/4hPfncN",
    pairWith: {
      href: "/book/noah-and-gods-big-promise",
      title: "Noah and God's Big Promise",
    },
  },
  {
    title: "Let Your Light Shine",
    verse: "Matthew 5:16",
    image: "/shop/let-your-light-shine.webp",
    alt: "Smiling star illustration for the Let Your Light Shine tee, Matthew 5:16",
  },
  {
    title: "Jesus Loves Me",
    verse: "John 15:9",
    image: "/shop/jesus-loves-me.webp",
    alt: "Bunny illustration for the Jesus Loves Me tee, John 15:9",
  },
  {
    title: "Fearfully and Wonderfully Made",
    verse: "Psalm 139:14",
    image: "/shop/fearfully-and-wonderfully-made.webp",
    alt: "Bear illustration for the Fearfully and Wonderfully Made tee, Psalm 139:14",
  },
  {
    title: "The Lord Is My Shepherd",
    verse: "Psalm 23:1",
    image: "/shop/the-lord-is-my-shepherd.webp",
    alt: "Shepherd illustration for The Lord Is My Shepherd tee, Psalm 23:1",
    pairWith: {
      href: "/book/david-and-the-giant",
      title: "David and the Giant",
    },
  },
  {
    title: "Two by Two",
    verse: "Genesis 7:9",
    image: "/shop/two-by-two.webp",
    alt: "Ark illustration for the Two by Two tee, Genesis 7:9",
    pairWith: {
      href: "/book/noah-and-gods-big-promise",
      title: "Noah and God's Big Promise",
    },
  },
  {
    title: "God Is With Me",
    verse: "Joshua 1:9",
    image: "/shop/god-is-with-me.webp",
    alt: "Lion illustration for the God Is With Me tee, Joshua 1:9",
    pairWith: {
      href: "/book/joshua-and-jericho",
      title: "Joshua and Jericho",
    },
  },
  {
    title: "Joyful Heart",
    verse: "Proverbs 17:22",
    image: "/shop/joyful-heart.webp",
    alt: "Sunflower illustration for the Joyful Heart tee, Proverbs 17:22",
  },
  {
    title: "Be Kind",
    verse: "Ephesians 4:32",
    image: "/shop/be-kind.webp",
    alt: "Fox illustration for the Be Kind tee, Ephesians 4:32",
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

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-16 pt-32 text-center">
        <div className="opacity-0 animate-fade-up mx-auto max-w-[700px]">
          <h1 className="mb-3 font-display text-4xl font-bold text-chestnut sm:text-5xl">
            Little Hearts Tees
          </h1>
          <p className="text-base text-chestnut-soft sm:text-lg">
            Gentle Bible verse tees for little ones.
          </p>
          <p className="mt-2 text-sm font-semibold text-chestnut-soft">
            by Faith Rivers
          </p>
          <div className="mb-8 mt-3 text-xl tracking-widest text-gold">
            {"\u2726 \u2726 \u2726"}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tees.map((tee, index) => {
            const isLive = Boolean(tee.amazonUrl);

            return (
              <div key={tee.title} className="flex h-full flex-col">
                <article
                  className={
                    isLive
                      ? "opacity-0 animate-fade-up flex h-full flex-col rounded-3xl border border-white/80 bg-cream/85 p-5 shadow-md backdrop-blur-md sm:p-6"
                      : "opacity-0 animate-fade-up flex h-full flex-col rounded-3xl border-2 border-dashed border-terracotta/35 bg-cream/55 p-5 backdrop-blur-md sm:p-6"
                  }
                  style={{ animationDelay: `${0.12 + index * 0.05}s` }}
                >
                  <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-2xl bg-white shadow-md">
                    <Image
                      src={tee.image}
                      alt={tee.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain"
                      priority={index < 2}
                    />
                  </div>

                  <h2 className="mb-1.5 font-display text-2xl font-bold leading-tight text-chestnut">
                    {tee.title}
                  </h2>
                  <p className="mb-4 font-display text-base italic text-chestnut-soft">
                    {tee.verse}
                  </p>

                  <div className="mt-auto">
                    {isLive ? (
                      <a
                        href={tee.amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold text-cream shadow-md transition-all hover:scale-105 hover:bg-chestnut"
                      >
                        Shop on Amazon
                      </a>
                    ) : (
                      <span className="inline-flex items-center justify-center rounded-full border border-dashed border-terracotta/35 bg-cream/80 px-6 py-3.5 text-sm font-semibold text-chestnut-soft">
                        Coming soon
                      </span>
                    )}
                  </div>
                </article>

                {tee.pairWith && (
                  <a
                    href={tee.pairWith.href}
                    className="mt-3 text-sm text-chestnut-soft underline-offset-2 hover:text-terracotta hover:underline"
                  >
                    Pair it with {tee.pairWith.title}
                  </a>
                )}
              </div>
            );
          })}
        </div>

        <a
          href="/"
          className="mt-10 inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-chestnut-soft shadow-sm backdrop-blur transition hover:bg-white hover:text-terracotta"
        >
          &larr; Back to Books
        </a>
      </section>
      <SiteFooter />
    </main>
  );
}
