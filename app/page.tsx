import { Suspense } from "react";
import { books } from "./books";
import BookCollection from "@/components/BookCollection";
import NewsletterSignup from "@/components/NewsletterSignup";
import RainbowArc from "@/components/RainbowArc";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";

const availableBooks = books.filter((book) => book.status === "available");

const bookStructuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Bible Stories for Little Hearts Book Collection",
  description:
    "Warm, gentle retellings of Bible stories for children ages 3 to 8.",
  itemListElement: availableBooks.map((book, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Book",
      name: book.title,
      description: book.blurb,
      bookFormat: "https://schema.org/Paperback",
      inLanguage: "en",
      isFamilyFriendly: true,
      audience: {
        "@type": "PeopleAudience",
        suggestedMinAge: 3,
        suggestedMaxAge: 8,
      },
      genre: ["Christian children's books", "Bible stories for kids"],
      offers: book.amazonUrl
        ? {
            "@type": "Offer",
            url: book.amazonUrl,
            availability: "https://schema.org/InStock",
          }
        : undefined,
    },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookStructuredData) }}
      />

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

      <SiteNav brandHref="#top" />

      <header
        id="top"
        className="relative overflow-hidden px-6 pb-6 pt-32 text-center sm:pb-8 sm:pt-36"
      >
        <RainbowArc />

        <div className="relative z-10">
          <span
            className="opacity-0 animate-fade-up mb-6 inline-block rounded-full border border-terracotta/20 bg-white/55 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta backdrop-blur-sm"
            style={{ animationDelay: "0.1s" }}
          >
            A Children&apos;s Book Series
          </span>

          <h1
            className="opacity-0 animate-fade-up mb-5 font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-chestnut sm:text-6xl md:text-7xl"
            style={{ animationDelay: "0.25s" }}
          >
            Bible Stories
            <br />
            <span className="font-medium italic text-terracotta">
              for Little Hearts
            </span>
          </h1>

          <p
            className="opacity-0 animate-fade-up mx-auto max-w-2xl font-display text-[15px] italic leading-relaxed text-chestnut-soft sm:text-xl md:text-2xl"
            style={{ animationDelay: "0.4s" }}
          >
            Warm, gentle retellings of the greatest Bible stories &mdash;
            beautifully illustrated picture books for ages 3 to 8.
          </p>

          <div
            className="opacity-0 animate-fade-up mt-8 inline-block animate-bob text-2xl text-chestnut-soft"
            style={{ animationDelay: "0.55s" }}
          >
            &darr;
          </div>

          <a
            href="/tonight"
            className="opacity-0 animate-fade-up mt-5 inline-flex rounded-full bg-terracotta px-6 py-3 text-sm font-bold text-cream shadow-md backdrop-blur transition hover:bg-chestnut"
            style={{ animationDelay: "0.65s" }}
          >
            Not sure what to read tonight?
          </a>
          <div>
            <a
              href="/play"
              className="opacity-0 animate-fade-up mt-4 inline-flex rounded-full border border-gold/50 bg-cream/80 px-5 py-2.5 text-sm font-bold text-terracotta shadow-sm backdrop-blur transition hover:bg-terracotta hover:text-cream"
              style={{ animationDelay: "0.75s" }}
            >
              New! Play today's story puzzle &rarr;
            </a>
          </div>
        </div>
      </header>

      <Suspense fallback={null}>
        <BookCollection books={books} />
      </Suspense>

      <NewsletterSignup />

      <SiteFooter />
    </>
  );
}
