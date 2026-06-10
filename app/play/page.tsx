import type { Metadata } from "next";
import DailyPuzzle from "@/components/play/DailyPuzzle";
import RainbowArc from "@/components/RainbowArc";
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
    <>
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

      {!PLAY_IS_LIVE && (
        <div className="bg-chestnut px-4 py-2 text-center text-sm font-semibold text-cream">
          Preview - this page is in testing.
        </div>
      )}

      <header className="relative px-6 pb-5 pt-10 text-center sm:pb-6 sm:pt-16">
        <RainbowArc />

        <span className="mb-5 inline-block rounded-full border border-terracotta/20 bg-white/55 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta backdrop-blur-sm">
          Free Daily Game
        </span>
        <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-chestnut sm:text-6xl">
          Play Corner
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-display text-base italic text-chestnut-soft sm:text-lg">
          A new story puzzle every day - solve it and collect stickers from your favorite Bible stories.
        </p>
        <div className="mt-7 text-xl tracking-[0.5em] text-gold">* * *</div>
      </header>

      <DailyPuzzle />
    </>
  );
}
