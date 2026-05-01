import { books } from "@/app/books";
import { notFound } from "next/navigation";
import Image from "next/image";

type BookTheme = {
  pageClass: string;
  quoteClass: string;
  badgeClass: string;
  glowClass: string;
  icons: { emoji: string; label: string }[];
  quote: string;
  art: "rainbow" | "hills" | "sea" | "default";
};

const themes: Record<string, BookTheme> = {
  "noah-and-gods-big-promise": {
    pageClass: "bg-gradient-to-b from-sky via-cream to-sage",
    quoteClass: "bg-gradient-to-r from-sky/70 via-cream to-gold/30",
    badgeClass: "bg-sage/70 text-chestnut-soft",
    glowClass: "bg-blue-300/30",
    quote: "When the storms come, God’s promises always shine like a rainbow.",
    art: "rainbow",
    icons: [
      { emoji: "🌈", label: "Promise" },
      { emoji: "🕊️", label: "Peace" },
      { emoji: "❤️", label: "Trust" },
    ],
  },
  "david-and-the-giant": {
    pageClass: "bg-gradient-to-b from-peach via-cream to-gold/30",
    quoteClass: "bg-gradient-to-r from-peach/80 via-cream to-gold/40",
    badgeClass: "bg-gold/30 text-chestnut-soft",
    glowClass: "bg-gold/30",
    quote: "Even when we feel small, faith gives us courage to face the biggest giants.",
    art: "hills",
    icons: [
      { emoji: "🐑", label: "Shepherd" },
      { emoji: "🪨", label: "Courage" },
      { emoji: "⭐", label: "Faith" },
    ],
  },
  "moses-and-the-red-sea": {
    pageClass: "bg-gradient-to-b from-sky via-blue-50 to-cream",
    quoteClass: "bg-gradient-to-r from-sky/80 via-cream to-blue-100",
    badgeClass: "bg-sky/80 text-chestnut-soft",
    glowClass: "bg-sky/50",
    quote: "When there seems to be no way, God can make a way through the sea.",
    art: "sea",
    icons: [
      { emoji: "🌊", label: "Miracle" },
      { emoji: "🧭", label: "Leader" },
      { emoji: "🙏", label: "Faith" },
    ],
  },
};

const defaultTheme: BookTheme = {
  pageClass: "bg-gradient-to-b from-cream via-peach/40 to-sage/50",
  quoteClass: "bg-gradient-to-r from-cream to-peach/40",
  badgeClass: "bg-sage/70 text-chestnut-soft",
  glowClass: "bg-gold/20",
  quote: "A gentle Bible story made with love for little hearts.",
  art: "default",
  icons: [
    { emoji: "📖", label: "Story" },
    { emoji: "❤️", label: "Heart" },
    { emoji: "✨", label: "Faith" },
  ],
};

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

function StorybookArt({ art }: { art: BookTheme["art"] }) {
  if (art === "rainbow") {
    return (
      <>
        <div className="pointer-events-none absolute left-1/2 top-20 h-36 w-[520px] -translate-x-1/2 rounded-t-full border-[18px] border-b-0 border-pink-soft/80 opacity-80" />
        <div className="pointer-events-none absolute left-1/2 top-[92px] h-32 w-[460px] -translate-x-1/2 rounded-t-full border-[16px] border-b-0 border-gold/70 opacity-80" />
        <div className="pointer-events-none absolute left-1/2 top-[104px] h-28 w-[400px] -translate-x-1/2 rounded-t-full border-[14px] border-b-0 border-sage/80 opacity-80" />
        <div className="pointer-events-none absolute left-1/2 top-[115px] h-24 w-[340px] -translate-x-1/2 rounded-t-full border-[12px] border-b-0 border-sky/90 opacity-80" />
      </>
    );
  }

  if (art === "hills") {
    return (
      <>
        <div className="pointer-events-none absolute right-14 top-20 h-28 w-28 rounded-full bg-gold/60 blur-sm animate-bob" />
        <div className="pointer-events-none absolute bottom-0 left-[-8%] h-48 w-[60%] rounded-t-full bg-sage/60" />
        <div className="pointer-events-none absolute bottom-[-20px] right-[-10%] h-56 w-[65%] rounded-t-full bg-gold/25" />
        <div className="pointer-events-none absolute left-[12%] top-[28%] text-6xl opacity-60 animate-bob">🐑</div>
        <div className="pointer-events-none absolute right-[15%] bottom-[18%] text-5xl opacity-50 animate-twinkle">⭐</div>
      </>
    );
  }

  if (art === "sea") {
    return (
      <>
        <div className="pointer-events-none absolute left-[-12%] top-[22%] h-[520px] w-[36%] rounded-r-full bg-sky/65 blur-sm animate-bob" />
        <div className="pointer-events-none absolute right-[-12%] top-[22%] h-[520px] w-[36%] rounded-l-full bg-sky/65 blur-sm animate-bob" style={{ animationDelay: "0.5s" }} />
        <div className="pointer-events-none absolute bottom-0 left-0 h-28 w-full bg-gradient-to-t from-sky/70 to-transparent" />
        <div className="pointer-events-none absolute left-[18%] bottom-[18%] text-5xl opacity-60 animate-bob">🌊</div>
        <div className="pointer-events-none absolute right-[20%] top-[18%] text-5xl opacity-50 animate-twinkle">✨</div>
      </>
    );
  }

  return null;
}

export default function BookPage({ params }: { params: { slug: string } }) {
  const book = books.find((b) => b.slug === params.slug);

  if (!book) return notFound();

  const theme = themes[book.slug] || defaultTheme;

  return (
    <main className={`relative min-h-screen overflow-hidden ${theme.pageClass} text-chestnut`}>
      <div className="absolute inset-0 opacity-80">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/30 blur-3xl" />
        <div className="absolute left-[-80px] top-24 h-44 w-44 rounded-full bg-white/60 blur-2xl animate-bob" />
        <div className="absolute right-[-60px] top-40 h-36 w-56 rounded-full bg-white/60 blur-2xl animate-bob" style={{ animationDelay: "0.7s" }} />
        <div className={`absolute bottom-[-80px] left-[-80px] h-64 w-64 rounded-full ${theme.glowClass} blur-3xl`} />
        <div className="absolute bottom-[-70px] right-[-70px] h-64 w-64 rounded-full bg-sage/60 blur-3xl" />
      </div>

      <StorybookArt art={theme.art} />

      <section className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
        <a
          href="/"
          className="mb-8 inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-chestnut-soft shadow-sm backdrop-blur transition hover:bg-white"
        >
          ← Back to all books
        </a>

        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
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

            <div className={`mb-7 rounded-3xl ${theme.quoteClass} p-5 shadow-inner`}>
              <p className="font-display text-xl font-semibold italic text-chestnut">
                “{theme.quote}”
              </p>
            </div>

            <p className="mb-7 text-base leading-relaxed text-chestnut-soft sm:text-lg">
              {book.blurb}
            </p>

            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              {theme.icons.map((item) => (
                <div key={item.label} className="rounded-2xl bg-cream/80 p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-1 text-2xl">{item.emoji}</div>
                  <p className="text-xs font-bold uppercase tracking-wider text-chestnut-soft">{item.label}</p>
                </div>
              ))}
            </div>

            {book.theme && (
              <div className="mb-8">
                <span className={`inline-flex rounded-full px-5 py-2 text-sm font-bold uppercase tracking-wider shadow-sm ${theme.badgeClass}`}>
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
