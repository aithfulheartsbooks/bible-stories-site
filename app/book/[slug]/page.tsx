import { books } from "@/app/books";
import { notFound } from "next/navigation";
import Image from "next/image";

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export default function BookPage({ params }: { params: { slug: string } }) {
  const book = books.find((b) => b.slug === params.slug);

  if (!book) return notFound();

  const isNoah = book.slug === "noah-and-gods-big-promise";

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky via-cream to-sage text-chestnut">
      {/* Storybook background */}
      {isNoah && (
        <>
          <div className="absolute inset-0 opacity-80">
            <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/30 blur-3xl" />
            <div className="absolute left-[-80px] top-24 h-44 w-44 rounded-full bg-white/60 blur-2xl animate-bob" />
            <div className="absolute right-[-60px] top-40 h-36 w-56 rounded-full bg-white/60 blur-2xl animate-bob" style={{ animationDelay: "0.7s" }} />
            <div className="absolute bottom-[-80px] left-[-80px] h-64 w-64 rounded-full bg-blue-300/30 blur-3xl" />
            <div className="absolute bottom-[-70px] right-[-70px] h-64 w-64 rounded-full bg-sage/60 blur-3xl" />
          </div>

          <div className="pointer-events-none absolute left-1/2 top-20 h-36 w-[520px] -translate-x-1/2 rounded-t-full border-[18px] border-b-0 border-pink-soft/80 opacity-80" />
          <div className="pointer-events-none absolute left-1/2 top-[92px] h-32 w-[460px] -translate-x-1/2 rounded-t-full border-[16px] border-b-0 border-gold/70 opacity-80" />
          <div className="pointer-events-none absolute left-1/2 top-[104px] h-28 w-[400px] -translate-x-1/2 rounded-t-full border-[14px] border-b-0 border-sage/80 opacity-80" />
          <div className="pointer-events-none absolute left-1/2 top-[115px] h-24 w-[340px] -translate-x-1/2 rounded-t-full border-[12px] border-b-0 border-sky/90 opacity-80" />
        </>
      )}

      <section className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
        <a
          href="/"
          className="mb-8 inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-chestnut-soft shadow-sm backdrop-blur transition hover:bg-white"
        >
          ← Back to all books
        </a>

        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Book cover */}
          <div className="opacity-0 animate-fade-up flex justify-center" style={{ animationDelay: "0.1s" }}>
            <div className="relative">
              <div className="absolute -inset-6 rounded-[2rem] bg-white/35 blur-xl" />
              <div className="relative rounded-[2rem] bg-white/70 p-5 shadow-2xl backdrop-blur-md ring-1 ring-white/80">
                {book.coverImage && (
                  <div className="relative h-[390px] w-[260px] sm:h-[480px] sm:w-[320px]">
                    <Image
                      src={book.coverImage}
                      alt={`${book.title} book cover`}
                      fill
                      priority
                      className="rounded-2xl object-contain shadow-lg transition duration-500 hover:scale-[1.02]"
                    />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-5 left-1/2 -z-0 h-8 w-64 -translate-x-1/2 rounded-full bg-chestnut/20 blur-xl" />
            </div>
          </div>

          {/* Book details */}
          <div className="opacity-0 animate-fade-up rounded-[2rem] bg-white/75 p-8 shadow-xl backdrop-blur-md ring-1 ring-white/80 sm:p-10" style={{ animationDelay: "0.25s" }}>
            <div className="mb-5 flex flex-wrap gap-3">
              <span className="rounded-full bg-terracotta/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-terracotta">
                {book.number}
              </span>
              {book.ageRange && (
                <span className="rounded-full bg-sky/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-chestnut-soft">
                  {book.ageRange}
                </span>
              )}
            </div>

            <h1 className="mb-4 font-display text-4xl font-extrabold leading-tight text-chestnut sm:text-5xl">
              {book.title}
            </h1>

            <p className="mb-6 font-display text-xl italic text-terracotta">
              {book.subtitle}
            </p>

            {isNoah && (
              <div className="mb-7 rounded-3xl bg-gradient-to-r from-sky/70 via-cream to-gold/30 p-5 shadow-inner">
                <p className="font-display text-xl font-semibold italic text-chestnut">
                  “When the storms come, God’s promises always shine like a rainbow.”
                </p>
              </div>
            )}

            <p className="mb-7 text-base leading-relaxed text-chestnut-soft sm:text-lg">
              {book.blurb}
            </p>

            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-cream/80 p-4 text-center shadow-sm">
                <div className="mb-1 text-2xl">🌈</div>
                <p className="text-xs font-bold uppercase tracking-wider text-chestnut-soft">Promise</p>
              </div>
              <div className="rounded-2xl bg-cream/80 p-4 text-center shadow-sm">
                <div className="mb-1 text-2xl">🕊️</div>
                <p className="text-xs font-bold uppercase tracking-wider text-chestnut-soft">Peace</p>
              </div>
              <div className="rounded-2xl bg-cream/80 p-4 text-center shadow-sm">
                <div className="mb-1 text-2xl">❤️</div>
                <p className="text-xs font-bold uppercase tracking-wider text-chestnut-soft">Trust</p>
              </div>
            </div>

            {book.theme && (
              <div className="mb-8">
                <span className="inline-flex rounded-full bg-sage/70 px-5 py-2 text-sm font-bold uppercase tracking-wider text-chestnut-soft shadow-sm">
                  Theme: {book.theme}
                </span>
              </div>
            )}

            {book.status === "available" && book.amazonUrl && (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={book.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-terracotta px-8 py-4 text-lg font-bold text-cream shadow-lg transition hover:scale-105 hover:bg-chestnut"
                >
                  Buy on Amazon →
                </a>
                <span className="text-sm font-semibold text-chestnut-soft">
                  A gentle Bible story for ages 3–8
                </span>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
