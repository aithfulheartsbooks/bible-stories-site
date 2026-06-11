"use client";

import { useEffect, useState } from "react";
import type { Sticker } from "@/lib/play/rotation";
import type { PlaySave } from "@/lib/play/storage";
import StickerImage from "./StickerImage";

type Props = {
  stickers: Sticker[];
  save: PlaySave;
};

const ALBUM_AVATAR_KEY = "play-album-avatar";

const albumAvatars = [
  { id: "lamb", label: "Lamb", icon: "\uD83D\uDC11", bg: "from-cream via-white to-gold/25" },
  { id: "dove", label: "Dove", icon: "\uD83D\uDD4A\uFE0F", bg: "from-sky-100 via-white to-cream-deep" },
  { id: "lion", label: "Lion", icon: "\uD83E\uDD81", bg: "from-gold/30 via-cream to-terracotta/20" },
  { id: "fish", label: "Fish", icon: "\uD83D\uDC1F", bg: "from-sky-100 via-cream to-sage/30" },
  { id: "donkey", label: "Donkey", icon: "\uD83D\uDC34", bg: "from-cream-deep via-white to-chestnut/15" },
  { id: "sparrow", label: "Sparrow", icon: "\uD83D\uDC26", bg: "from-pink-100 via-cream to-gold/20" },
];

export default function StickerAlbum({ stickers, save }: Props) {
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);
  const [wiggleId, setWiggleId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [albumAvatar, setAlbumAvatar] = useState<string | null | undefined>(undefined);
  const storyStickers = stickers.filter((sticker) => sticker.rarity === "common");
  const bonusStickers = stickers.filter((sticker) => sticker.rarity === "golden" && save.earned[sticker.id]);
  const earnedCount = storyStickers.filter((sticker) => save.earned[sticker.id]).length;
  const earnedStoryStickers = storyStickers.filter((sticker) => save.earned[sticker.id]);
  const lockedStoryStickers = storyStickers.filter((sticker) => !save.earned[sticker.id]);
  const visibleStoryStickers = showAll
    ? storyStickers
    : [...earnedStoryStickers, ...lockedStoryStickers.slice(0, 12)];
  const progress = storyStickers.length ? Math.round((earnedCount / storyStickers.length) * 100) : 0;
  const selectedAvatar = albumAvatars.find((avatar) => avatar.id === albumAvatar);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(ALBUM_AVATAR_KEY);
      setAlbumAvatar(albumAvatars.some((avatar) => avatar.id === stored) ? stored : null);
    } catch {
      setAlbumAvatar("lamb");
    }
  }, []);

  function chooseAvatar(avatarId: string) {
    setAlbumAvatar(avatarId);
    try {
      window.localStorage.setItem(ALBUM_AVATAR_KEY, avatarId);
    } catch {
      // Storage may be unavailable.
    }
  }

  function tapLocked(stickerId: string) {
    setWiggleId(stickerId);
    window.setTimeout(() => setWiggleId(null), 450);
  }

  return (
    <section className="rounded-3xl border border-white/80 bg-cream/85 p-5 shadow-md backdrop-blur-md sm:p-7">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          {selectedAvatar && (
            <button
              type="button"
              onClick={() => setAlbumAvatar(null)}
              className={`grid h-14 w-14 shrink-0 place-items-center rounded-full border-4 border-cream bg-gradient-to-br ${selectedAvatar.bg} text-2xl shadow-sm transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold`}
              aria-label="Change album avatar"
            >
              <span aria-hidden="true">{selectedAvatar.icon}</span>
            </button>
          )}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
              My Sticker Album
            </p>
            <h2 className="font-display text-2xl font-bold text-chestnut">Collected stickers</h2>
          </div>
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
        {visibleStoryStickers.map((sticker) => {
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
                  <StickerImage src={sticker.image} alt={sticker.name} sizes="92px" />
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

      {storyStickers.length > visibleStoryStickers.length && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-white/75 px-5 py-3 text-sm font-semibold text-chestnut-soft shadow-sm transition hover:bg-cream-deep"
        >
          Show all stickers
        </button>
      )}

      {showAll && storyStickers.length > earnedStoryStickers.length + 12 && (
        <button
          type="button"
          onClick={() => setShowAll(false)}
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-cream-deep px-5 py-3 text-sm font-semibold text-chestnut-soft transition hover:bg-gold/25"
        >
          Show fewer stickers
        </button>
      )}

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
                  <StickerImage src={sticker.image} alt={sticker.name} sizes="92px" />
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
              <StickerImage src={selectedSticker.image} alt={selectedSticker.name} sizes="144px" />
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

      {albumAvatar === null && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-chestnut/35 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-3xl border border-white/80 bg-cream p-6 text-center shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">Album owner</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-chestnut">
              Who does this album belong to?
            </h3>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {albumAvatars.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => chooseAvatar(avatar.id)}
                  className={`grid aspect-square place-items-center rounded-full border-4 border-cream bg-gradient-to-br ${avatar.bg} text-4xl shadow-sm transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold`}
                  aria-label={avatar.label}
                >
                  <span aria-hidden="true">{avatar.icon}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
