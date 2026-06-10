"use client";

import Image from "next/image";
import type { Sticker } from "@/lib/play/rotation";
import type { PlaySave } from "@/lib/play/storage";

type Props = {
  stickers: Sticker[];
  save: PlaySave;
};

export default function StickerAlbum({ stickers, save }: Props) {
  const storyStickers = stickers.filter((sticker) => sticker.rarity === "common");
  const bonusStickers = stickers.filter((sticker) => sticker.rarity === "golden" && save.earned[sticker.id]);
  const earnedCount = storyStickers.filter((sticker) => save.earned[sticker.id]).length;
  const progress = storyStickers.length ? Math.round((earnedCount / storyStickers.length) * 100) : 0;

  return (
    <section className="rounded-3xl border border-white/80 bg-cream/85 p-5 shadow-md backdrop-blur-md sm:p-7">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
            My Sticker Album
          </p>
          <h2 className="font-display text-2xl font-bold text-chestnut">Collected stickers</h2>
        </div>
        <p className="rounded-full bg-cream-deep px-4 py-2 text-sm font-semibold text-chestnut-soft">
          {earnedCount} of {storyStickers.length} books
        </p>
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
              <div
                className={
                  earned
                    ? "relative mx-auto mb-2 aspect-square w-full max-w-[92px] overflow-hidden rounded-full border-4 border-cream bg-white shadow-md"
                    : "relative mx-auto mb-2 aspect-square w-full max-w-[92px] overflow-hidden rounded-full border-4 border-cream-deep bg-white/60 opacity-70 shadow-sm grayscale"
                }
              >
                <Image
                  src={sticker.image}
                  alt={earned ? sticker.name : "Locked sticker"}
                  fill
                  sizes="92px"
                  className="object-cover"
                />
                {!earned && (
                  <span className="absolute inset-0 grid place-items-center bg-cream/45 text-lg font-bold text-chestnut">
                    ?
                  </span>
                )}
                {earned?.golden && (
                  <span className="absolute inset-1 rounded-full border-4 border-gold" aria-hidden="true" />
                )}
              </div>
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
                <div className="relative mx-auto mb-2 aspect-square w-full max-w-[92px] overflow-hidden rounded-full border-4 border-cream bg-white shadow-md">
                  <Image
                    src={sticker.image}
                    alt={sticker.name}
                    fill
                    sizes="92px"
                    className="object-cover"
                  />
                  <span className="absolute inset-1 rounded-full border-4 border-gold" aria-hidden="true" />
                </div>
                <p className="min-h-[2.5rem] text-xs font-semibold leading-tight text-chestnut-soft">
                  {sticker.name}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
