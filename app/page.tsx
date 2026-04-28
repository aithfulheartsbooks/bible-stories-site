import { books } from "./books";
import BookCard from "@/components/BookCard";
import RainbowArc from "@/components/RainbowArc";

export default function Home() {
  return (
    <>
      {/* Background scenery */}
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

      {/* Hero */}
      <header className="relative px-6 pb-12 pt-24 text-center sm:pt-28">
        <RainbowArc />

        <span
          className="opacity-0 animate-fade-up mb-6 inline-block rounded-full border border-terracotta/20 bg-white/55 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta backdrop-blur-sm"
          style={{ animationDelay: "0.1s" }}
        >
          A Children&apos;s Book Series
        </span>

        <h1
          className="opacity-0 animate-fade-up mb-4 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-chestnut sm:text-6xl md:text-7xl"
          style={{ animationDelay: "0.25s" }}
        >
          Bible Stories
          <br />
          <span className="font-medium italic text-terracotta">
            for Little Hearts
          </span>
        </h1>

        <p
          className="opacity-0 animate-fade-up mx-auto max-w-xl font-display text-base italic text-chestnut-soft sm:text-lg md:text-xl"
          style={{ animationDelay: "0.4s" }}
        >
          Warm, gentle retellings of the greatest Bible stories — beautifully
          illustrated picture books for ages 4 to 8.
        </p>

        <div
          className="opacity-0 animate-fade-up mt-12 inline-block animate-bob text-2xl text-chestnut-soft"
          style={{ animationDelay: "0.55s" }}
        >
          ↓
        </div>
      </header>

      {/* Books Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-8">
        <div className="opacity-0 animate-fade-up mb-12 text-center">
          <div className="mb-2 text-xl tracking-[0.5em] text-gold">✦ ✦ ✦</div>
          <h2 className="font-display text-3xl font-semibold text-chestnut">
            Our Storybook Collection
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book, index) => (
            <BookCard key={book.number} book={book} index={index} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pb-16 pt-12 text-center text-chestnut-soft">
        <div className="mx-auto mb-6 h-0.5 w-16 rounded bg-gold/50" />
        <p className="mx-auto max-w-lg font-display text-base italic">
          &ldquo;Let the little children come to me.&rdquo; — A series made with
          love for growing hearts.
        </p>
        <p className="mt-6 text-sm opacity-70">
          © {new Date().getFullYear()} Bible Stories for Little Hearts. All
          rights reserved.
        </p>
      </footer>
    </>
  );
}
