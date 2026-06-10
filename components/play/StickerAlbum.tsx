"use client";

import { useState } from "react";
import Image from "next/image";
import type { Sticker } from "@/lib/play/rotation";
import type { PlaySave } from "@/lib/play/storage";

type Props = {
  stickers: Sticker[];
  save: PlaySave;
};

export default function StickerAlbum({ stickers, save }: Props) {
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);
  const [wiggleId, setWiggleId] = useState<string | null>(null);
  const storyStickers = stickers.filter((sticker) => sticker.rarity === "common");
  const bonusStickers = stickers.filter((sticker) => sticker.rarity === "golden" && save.earned[sticker.id]);
  const earnedCount = storyStickers.filter((sticker) => save.earned[sticker.id]).length;
  const progress = storyStickers.length ? Math.round((earnedCount / storyStickers.length) * 100) : 0;

  function tapLocked(stickerId: string) {
    setWiggleId(stickerId);
    window.setTimeout(() => setWiggleId(null), 450);
  }

  return (
    <section className="rounded-3xl border border-white/80 bg-cream/85 p-5 shadow-md backdrop-blur-md sm:p-7">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
            My Sticker Album
          </p>
          <h2 className="font-display text-2xl font-bold text-chestnut">Collected stickers</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <p className="rounded-full bg-cream-deep px-4 py-2 text-sm font-semibold text-chestnut-soft">
            {earnedCount} of {storyStickers.length}
          </p>
          <p className="rounded-full bg-gold/20 px-4 py-2 text-sm font-semibold text-chestnut-soft">
            {save.practiceStars} practice stars
          </p>
        </div>
      </div>

      <div className="mb-6 h-3 overflow-hidden rounded-full bg-white/70">
        <div
          className="h-full rounded-full bg-gold transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {save.currentStreak > 0 && (
        <p className="mb-5 rounded-2xl bg-gold/20 px-4 py-3 text-sm font-semibold text-chestnut-soft">
          {save.currentStreak} days in a row. Best streak: {save.bestStreak}.
        </p>
      )}

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4">
        {storyStickers.map((sticker) => {
          const earned = save.earned[sticker.id];

          return (
            <div key={sticker.id} className="text-center">
              <button
                type="button"
                onClick={() => (earned ? setSelectedSticker(sticker) : tapLocked(sticker.id))}
                className={
                  earned
                    ? "relative mx-auto mb-2 aspect-square w-full max-w-[92px] overflow-hidden rounded-full border-4 border-cream bg-white shadow-md transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold"
                    : `relative mx-auto mb-2 aspect-square w-full max-w-[92px] overflow-hidden rounded-full border-4 border-cream-deep bg-chestnut/15 shadow-sm focus:outline-none ${
                        wiggleId === sticker.id ? "play-locked-wiggle" : ""
                      }`
                }
                aria-label={earned ? `Open ${sticker.name}` : "Mystery sticker"}
              >
                {earned ? (
                  <Image
                    src={sticker.image}
                    alt={sticker.name}
                    fill
                    sizes="92px"
                    className="object-cover"
                  />
                ) : (
                  <span className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.6),rgba(138,91,67,0.28)_46%,rgba(82,50,39,0.42))] text-xl font-bold text-chestnut">
                    ?
                  </span>
                )}
                {earned?.golden && (
                  <span className="absolute inset-1 rounded-full border-4 border-gold" aria-hidden="true" />
                )}
              </button>
              {earned && (
                <p className="min-h-[2.5rem] text-xs font-semibold leading-tight text-chestnut-soft">
                  {sticker.name}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {bonusStickers.length > 0 && (
        <>
          <p className="mb-3 mt-7 text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
            Bonus streak badges
          </p>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4">
            {bonusStickers.map((sticker) => (
              <div key={sticker.id} className="text-center">
                <button
                  type="button"
                  onClick={() => setSelectedSticker(sticker)}
                  className="relative mx-auto mb-2 aspect-square w-full max-w-[92px] overflow-hidden rounded-full border-4 border-cream bg-white shadow-md transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <Image
                    src={sticker.image}
                    alt={sticker.name}
                    fill
                    sizes="92px"
                    className="object-cover"
                  />
                  <span className="absolute inset-1 rounded-full border-4 border-gold" aria-hidden="true" />
                </button>
                <p className="min-h-[2.5rem] text-xs font-semibold leading-tight text-chestnut-soft">
                  {sticker.name}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedSticker && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-chestnut/35 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-3xl border border-white/80 bg-cream p-6 text-center shadow-xl">
            <div className="relative mx-auto aspect-square w-36 overflow-hidden rounded-full border-4 border-cream-deep bg-white shadow-md">
              <Image
                src={selectedSticker.image}
                alt={selectedSticker.name}
                fill
                sizes="144px"
                className="object-cover"
              />
            </div>
            <h3 className="mt-4 font-display text-2xl font-bold text-chestnut">{selectedSticker.name}</h3>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-chestnut-soft">
              from {selectedSticker.bookTitle || "Bible Stories for Little Hearts"} - Book{" "}
              {selectedSticker.bookNumber}
            </p>
            <div className="mt-5 flex flex-col gap-3">
              {selectedSticker.bookUrl && (
                <a
                  href={selectedSticker.bookUrl}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-cream shadow-md transition hover:bg-chestnut"
                >
                  See this book
                </a>
              )}
              {selectedSticker.amazonUrl && (
                <a
                  href={selectedSticker.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-cream-deep px-5 py-3 text-sm font-semibold text-chestnut-soft transition hover:bg-gold/25"
                >
                  Find on Amazon
                </a>
              )}
              <button
                type="button"
                onClick={() => setSelectedSticker(null)}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-white/75 px-5 py-3 text-sm font-semibold text-chestnut-soft transition hover:bg-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
