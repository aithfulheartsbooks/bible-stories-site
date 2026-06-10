import type { Metadata } from "next";
import DailyPuzzle from "@/components/play/DailyPuzzle";
import RainbowArc from "@/components/RainbowArc";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "Daily Bible Story Puzzle for Kids | Bible Stories for Little Hearts",
  description:
    "Play free daily Bible story puzzles for kids ages 3-8. Solve today's three story puzzles, collect color stickers, and build a saved sticker album on this device.",
  openGraph: {
    title: "Daily Bible Story Puzzle for Kids",
    description:
      "Solve today's three Bible story puzzles and collect color stickers from Bible Stories for Little Hearts.",
    type: "website",
  },
};

export default function PlayPage() {
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

      <header
        id="top"
        className="relative overflow-hidden px-4 pb-2 pt-28 text-center sm:px-6 sm:pb-8 sm:pt-36"
      >
        <RainbowArc />

        <div className="relative z-10">
          <span className="opacity-0 animate-fade-up mb-1 inline-block rounded-full border border-terracotta/20 bg-white/55 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-terracotta backdrop-blur-sm sm:mb-6 sm:px-5 sm:py-2 sm:text-xs sm:tracking-[0.25em]">
            Free Daily Game
          </span>

          <h1 className="opacity-0 animate-fade-up mb-1 font-display text-3xl font-extrabold leading-none tracking-tight text-chestnut sm:mb-5 sm:text-6xl md:text-7xl">
            Play Corner
          </h1>

          <p className="opacity-0 animate-fade-up mx-auto max-w-2xl font-display text-xs italic leading-snug text-chestnut-soft sm:text-xl sm:leading-relaxed md:text-2xl">
            Three new story puzzles every day - solve them and collect stickers from your favorite Bible stories.
          </p>

          <div className="hidden opacity-0 animate-fade-up text-xl tracking-widest text-gold sm:mt-6 sm:block">
            {"\u2726 \u2726 \u2726"}
          </div>
        </div>
      </header>

      <DailyPuzzle />
      <SiteFooter />
    </main>
  );
}
