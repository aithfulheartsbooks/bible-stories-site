import Image from "next/image";
import SiteNav from "@/components/SiteNav";

export const metadata = {
  title: "Meet Faith Rivers | Bible Stories for Little Hearts",
  description:
    "Meet Faith Rivers, author of Bible Stories for Little Hearts.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden font-body text-chestnut">
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

      <section className="relative z-10 mx-auto max-w-[700px] px-6 pb-16 pt-24 text-center">
        <div className="opacity-0 animate-fade-up">
          <Image
            src="/Faith_Rivers.png"
            alt="Faith Rivers illustrated avatar"
            width={192}
            height={192}
            priority
            className="mx-auto mb-6 h-44 w-44 rounded-full object-cover shadow-lg ring-4 ring-white sm:h-48 sm:w-48"
          />
          <h1 className="mb-3 font-display text-4xl font-bold text-chestnut sm:text-5xl">
            Meet Faith Rivers
          </h1>
          <div className="mb-8 text-center text-xl tracking-widest text-gold">
            {"\u2726 \u2726 \u2726"}
          </div>
        </div>

        <div
          className="opacity-0 animate-fade-up mx-auto max-w-2xl rounded-3xl border border-white/80 bg-cream/85 p-8 text-center shadow-md backdrop-blur-md sm:p-10"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="space-y-5 text-base leading-relaxed text-chestnut-soft sm:text-lg">
            <p className="text-lg font-semibold text-chestnut sm:text-xl">
              Faith Rivers believes the greatest gift you can give a child is a
              love for God&apos;s Word &mdash; and that love begins with a story.
            </p>
            <p>
              The Bible Stories for Little Hearts series was born from a simple
              conviction: every child deserves to grow up knowing these stories
              &mdash; not just as history, but as living truth for their own
              hearts.
            </p>
            <p>
              Each book is crafted with soft watercolor illustrations, gentle
              language, and meaningful themes &mdash; designed to help little
              hearts understand faith, courage, love, and hope in a way that
              feels warm, clear, and truly memorable.
            </p>
            <p>
              Written with a prayer that every little heart who reads these
              stories would know how deeply they are loved by God.
            </p>
          </div>

          <p className="mx-auto mt-8 max-w-md font-display text-xl italic text-terracotta">
            &ldquo;Let the little children come to me.&rdquo;
            <br />
            <span className="text-base text-chestnut-soft">
              &mdash; Matthew 19:14
            </span>
          </p>

          <div className="mx-auto mt-8 h-0.5 w-[60px] rounded bg-gold/60" />

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="https://www.instagram.com/faithriversbooks/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-terracotta/25 bg-cream/80 px-5 py-2.5 text-sm font-semibold text-chestnut-soft shadow-sm transition hover:border-terracotta hover:bg-terracotta hover:text-cream"
            >
              Follow on Instagram
            </a>
            <a
              href="https://www.pinterest.com/faithfulheartsbooks/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-terracotta/25 bg-cream/80 px-5 py-2.5 text-sm font-semibold text-chestnut-soft shadow-sm transition hover:border-terracotta hover:bg-terracotta hover:text-cream"
            >
              Find us on Pinterest
            </a>
          </div>

          <a
            href="/"
            className="mt-8 inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-chestnut-soft shadow-sm backdrop-blur transition hover:bg-white hover:text-terracotta"
          >
            &larr; Back to Books
          </a>

          <p className="mt-6 text-xs font-semibold text-chestnut-soft/70">
            faithfulheartsbooks.com
          </p>
        </div>
      </section>
    </main>
  );
}
