"use client";

import Image from "next/image";
import type { Puzzle, Sticker } from "@/lib/play/rotation";

type Props = {
  puzzle: Puzzle;
  sticker?: Sticker;
  tomorrowSticker?: Sticker;
  golden: boolean;
};

export default function RewardCard({ puzzle, sticker, tomorrowSticker, golden }: Props) {
  if (!sticker) return null;

  return (
    <section className="rounded-3xl border border-white/80 bg-cream/90 p-5 shadow-md backdrop-blur-md sm:p-7">
      <div className="grid gap-5 sm:grid-cols-[110px_1fr] sm:items-center">
        <div className="relative mx-auto aspect-square w-28 overflow-hidden rounded-full border-4 border-cream bg-white shadow-lg">
          <Image src={sticker.image} alt={sticker.name} fill sizes="112px" className="scale-150 object-cover" />
          {golden && <span className="absolute inset-1 rounded-full border-4 border-gold" aria-hidden="true" />}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
            Sticker earned
          </p>
          <h2 className="font-display text-2xl font-bold leading-tight text-chestnut">
            You earned the {sticker.name}!
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-chestnut-soft">
            This scene is from <span className="font-semibold italic">{puzzle.bookTitle}</span> - Book{" "}
            {puzzle.bookNumber}. Read the whole story together tonight.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href={puzzle.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-cream shadow-md transition hover:scale-[1.02] hover:bg-chestnut"
            >
              Find the book on Amazon
            </a>
            {puzzle.coloringPageUrl && (
              <a
                href={puzzle.coloringPageUrl}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-cream-deep px-6 py-3 text-sm font-semibold text-chestnut-soft transition hover:bg-gold/25"
              >
                Print the coloring page
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4 rounded-2xl bg-white/50 p-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-4 border-cream-deep bg-cream text-2xl font-bold text-chestnut-soft">
          ?
        </div>
        <p className="text-sm font-semibold text-chestnut-soft">
          Come back tomorrow for a new puzzle
          {tomorrowSticker ? ` and a mystery ${tomorrowSticker.rarity} sticker.` : "."}
        </p>
      </div>
    </section>
  );
}
