"use client";

import { useEffect, useMemo, useState } from "react";
import type { Puzzle, Sticker } from "@/lib/play/rotation";
import StickerImage from "./StickerImage";

type Props = {
  puzzle: Puzzle;
  sticker?: Sticker;
  tomorrowSticker?: Sticker;
  golden: boolean;
  mode?: "daily" | "practice";
  allDailySolved?: boolean;
  newStoriesIn?: string;
  memoryVerse?: string;
  onPractice?: () => void;
  onStickerReveal?: () => void;
};

export default function RewardCard({
  puzzle,
  sticker,
  tomorrowSticker,
  golden,
  mode = "daily",
  allDailySolved = false,
  newStoriesIn,
  memoryVerse,
  onPractice,
  onStickerReveal,
}: Props) {
  const isPractice = mode === "practice";
  const giftStorageKey = sticker ? `play-gift-opened:${puzzle.id}:${sticker.id}` : "";
  const [giftTaps, setGiftTaps] = useState(0);
  const [giftOpened, setGiftOpened] = useState(() => !sticker || isPractice);
  const needsGift = Boolean(sticker && !isPractice);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!needsGift) {
      setGiftOpened(true);
      return;
    }

    try {
      setGiftOpened(reduce || window.localStorage.getItem(giftStorageKey) === "true");
    } catch {
      setGiftOpened(reduce);
    }
    setGiftTaps(0);
  }, [giftStorageKey, needsGift]);

  const giftInstruction = useMemo(() => {
    if (giftTaps === 0) return "Tap to open";
    if (giftTaps === 1) return "Tap again";
    return "One more tap";
  }, [giftTaps]);

  function tapGift() {
    if (!needsGift || giftOpened) return;

    const nextTaps = giftTaps + 1;
    setGiftTaps(nextTaps);

    if (nextTaps >= 3) {
      setGiftOpened(true);
      window.setTimeout(() => onStickerReveal?.(), 80);
      try {
        window.localStorage.setItem(giftStorageKey, "true");
      } catch {
        // Storage may be unavailable.
      }
    }
  }

  return (
    <section className="rounded-3xl border border-white/80 bg-cream/90 p-5 shadow-md backdrop-blur-md sm:p-7">
      <div className={sticker ? "grid gap-5 sm:grid-cols-[110px_1fr] sm:items-center" : "grid gap-4"}>
        {sticker && giftOpened && (
          <div className="play-sticker-pop relative mx-auto aspect-square w-28 overflow-hidden rounded-full border-4 border-cream bg-white shadow-lg">
            <StickerImage src={sticker.image} alt={sticker.name} sizes="112px" />
            {golden && <span className="absolute inset-1 rounded-full border-4 border-gold" aria-hidden="true" />}
          </div>
        )}

        {sticker && !giftOpened && (
          <button
            type="button"
            onClick={tapGift}
            className={`play-gift-shell relative mx-auto grid aspect-square w-28 place-items-center rounded-full border-4 border-cream bg-gold/25 shadow-lg focus:outline-none focus:ring-2 focus:ring-gold ${
              giftTaps === 0 ? "play-gift-wobble-1" : giftTaps === 1 ? "play-gift-wobble-2" : "play-gift-wobble-3"
            }`}
            aria-label="Open sticker gift"
          >
            <span className="play-gift-glow" aria-hidden="true" />
            <span className="relative text-5xl" aria-hidden="true">
              {"\uD83C\uDF81"}
            </span>
            <span className="absolute -bottom-8 text-xs font-bold text-terracotta">{giftInstruction}</span>
          </button>
        )}

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
            {isPractice ? "Practice star earned" : giftOpened ? "Sticker earned" : "Mystery gift"}
          </p>
          <h2 className="font-display text-2xl font-bold leading-tight text-chestnut">
            {isPractice
              ? "You solved another story!"
              : sticker && giftOpened
                ? `You earned the ${sticker.name}!`
                : "You solved the story!"}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-chestnut-soft">
            This scene is from <span className="font-semibold italic">{puzzle.bookTitle}</span> - Book{" "}
            {puzzle.bookNumber}. Read the whole story together tonight.
          </p>

          <div className="mt-5 grid gap-3">
            <a
              href={puzzle.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-terracotta px-6 py-3.5 text-center text-sm font-semibold leading-snug text-cream shadow-md transition hover:scale-[1.02] hover:bg-chestnut"
            >
              Find on Amazon →
            </a>
            {puzzle.coloringPageUrl && (
              <a
                href={puzzle.coloringPageUrl}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-cream-deep px-6 py-3.5 text-center text-sm font-semibold leading-snug text-chestnut-soft transition hover:bg-gold/25"
              >
                Print the coloring page
              </a>
            )}
          </div>
        </div>
      </div>

      {allDailySolved ? (
        <div className="mt-6 rounded-2xl bg-gold/20 p-4 text-center">
          <p className="font-display text-2xl font-bold text-chestnut">{"\u2726 \u2726 \u2726"}</p>
          <p className="mt-1 text-sm font-semibold text-chestnut-soft">Today&apos;s three stories are complete.</p>
          {memoryVerse && (
            <p className="mx-auto mt-3 max-w-sm font-display text-xl font-bold leading-snug text-chestnut">
              {memoryVerse}
            </p>
          )}
          {newStoriesIn && (
            <p className="mt-2 text-sm font-bold text-terracotta">New stories in {newStoriesIn}</p>
          )}
          {onPractice && (
            <button
              type="button"
              onClick={onPractice}
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-chestnut px-6 py-3 text-sm font-semibold text-cream shadow-md transition hover:bg-terracotta"
            >
              Play another puzzle
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 flex items-center gap-4 rounded-2xl bg-white/50 p-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-4 border-cream-deep bg-cream text-2xl font-bold text-chestnut-soft">
            ?
          </div>
          <p className="text-sm font-semibold text-chestnut-soft">
            {isPractice
              ? "Practice puzzles give stars, not new stickers."
              : `Keep going for today's next story${
                  tomorrowSticker ? ` and a mystery ${tomorrowSticker.rarity} sticker tomorrow.` : "."
                }`}
          </p>
        </div>
      )}
    </section>
  );
}
