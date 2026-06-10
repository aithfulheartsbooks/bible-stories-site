import type { Metadata } from "next";
import DailyPuzzle from "@/components/play/DailyPuzzle";
import RainbowArc from "@/components/RainbowArc";
import SiteNav from "@/components/SiteNav";
import { PLAY_IS_LIVE } from "@/lib/play/config";

export const metadata: Metadata = {
  title: "Play - Free Daily Bible Story Puzzle for Kids | Bible Stories for Little Hearts",
  description:
    "A free daily jigsaw puzzle for ages 3-8 made from beautiful watercolor Bible story illustrations. Solve today's puzzle and collect stickers!",
  robots: PLAY_IS_LIVE ? undefined : { index: false, follow: false },
  openGraph: {
    title: "Play - Free Daily Bible Story Puzzle for Kids",
    description:
      "Solve today's Bible story puzzle and collect stickers from Bible Stories for Little Hearts.",
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

      {!PLAY_IS_LIVE && (
        <div className="relative z-40 mt-[5.25rem] bg-chestnut px-4 py-2 text-center text-sm font-semibold text-cream sm:mt-[4.25rem]">
          Preview - this page is in testing.
        </div>
      )}

      <header
        id="top"
        className="relative overflow-hidden px-6 pb-3 pt-20 text-center sm:pb-8 sm:pt-36"
      >
        <RainbowArc />

        <div className="relative z-10">
          <span className="opacity-0 animate-fade-up mb-3 inline-block rounded-full border border-terracotta/20 bg-white/55 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta backdrop-blur-sm sm:mb-6">
            Free Daily Game
          </span>

          <h1 className="opacity-0 animate-fade-up mb-2 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-chestnut sm:mb-5 sm:text-6xl md:text-7xl">
            Play Corner
          </h1>

          <p className="opacity-0 animate-fade-up mx-auto max-w-2xl font-display text-[14px] italic leading-relaxed text-chestnut-soft sm:text-xl md:text-2xl">
            A new story puzzle every day - solve it and collect stickers from your favorite Bible stories.
          </p>

          <div className="opacity-0 animate-fade-up mt-3 text-xl tracking-widest text-gold sm:mt-6">
            {"\u2726 \u2726 \u2726"}
          </div>
        </div>
      </header>

      <DailyPuzzle />
    </main>
  );
}
