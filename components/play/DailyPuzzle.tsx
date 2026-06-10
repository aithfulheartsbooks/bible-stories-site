"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import Image from "next/image";
import StickerAlbum from "./StickerAlbum";
import RewardCard from "./RewardCard";
import {
  createShuffledTiles,
  getDailyPuzzle,
  getSticker,
  getTomorrowSticker,
  isSolved,
  puzzleManifest,
  type Difficulty,
} from "@/lib/play/rotation";
import {
  awardSolvedDay,
  defaultSave,
  readPlaySave,
  resetPlaySave,
  writePlaySave,
  type PlaySave,
} from "@/lib/play/storage";
import { PLAY_TUTORIAL_KEY, SHOW_CORRECT_DOTS } from "@/lib/play/config";

const difficultyOptions: { value: Difficulty; label: string; sublabel: string }[] = [
  { value: "2x2", label: "Little Hearts", sublabel: "Ages 3-5" },
  { value: "3x3", label: "Big Hearts", sublabel: "Ages 6-8" },
];

export default function DailyPuzzle() {
  const [daily, setDaily] = useState(() => getDailyPuzzle(new Date()));
  const [save, setSave] = useState<PlaySave>(defaultSave);
  const [hasLoadedSave, setHasLoadedSave] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("2x2");
  const [tiles, setTiles] = useState<number[]>(() =>
    createShuffledTiles(4, `${daily.puzzle.id}-${daily.dateKey}-2x2`)
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [peeking, setPeeking] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showPeekTip, setShowPeekTip] = useState(true);
  const [sparkles, setSparkles] = useState(false);
  const chimeRef = useRef<HTMLAudioElement | null>(null);

  const grid = difficulty === "2x2" ? 2 : 3;
  const tileCount = grid * grid;
  const sticker = getSticker(daily.puzzle.stickerId);
  const tomorrowSticker = getTomorrowSticker(new Date());
  const alreadySolvedToday = save.lastSolvedDate === daily.dateKey;
  const showDots = SHOW_CORRECT_DOTS[difficulty];

  useEffect(() => {
    setDaily(getDailyPuzzle(new Date()));
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const nextDaily = getDailyPuzzle(new Date());
      setDaily((currentDaily) => (currentDaily.dateKey === nextDaily.dateKey ? currentDaily : nextDaily));
    }, 60000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const image = new window.Image();
    let active = true;

    setImageReady(false);
    setImageFailed(false);
    image.onload = () => {
      if (active) setImageReady(true);
    };
    image.onerror = () => {
      if (active) setImageFailed(true);
    };
    image.src = daily.puzzle.image;

    if (image.complete && image.naturalWidth > 0) {
      setImageReady(true);
    }

    return () => {
      active = false;
    };
  }, [daily.puzzle.image]);

  useEffect(() => {
    const stored = readPlaySave();
    setSave(stored);
    setDifficulty(stored.difficulty);
    setSolved(stored.lastSolvedDate === daily.dateKey);
    setHasLoadedSave(true);

    try {
      setShowTutorial(window.localStorage.getItem(PLAY_TUTORIAL_KEY) !== "true");
    } catch {
      setShowTutorial(true);
    }
  }, [daily.dateKey]);

  useEffect(() => {
    if (!hasLoadedSave) return;

    setTiles(
      solved
        ? Array.from({ length: tileCount }, (_, index) => index)
        : createShuffledTiles(tileCount, `${daily.puzzle.id}-${daily.dateKey}-${difficulty}`)
    );
    setSelected(null);
  }, [daily.dateKey, daily.puzzle.id, difficulty, hasLoadedSave, solved, tileCount]);

  function dismissTutorial() {
    setShowTutorial(false);
    try {
      window.localStorage.setItem(PLAY_TUTORIAL_KEY, "true");
    } catch {
      // Storage may be unavailable.
    }
  }

  function updateSave(nextSave: PlaySave) {
    setSave(nextSave);
    writePlaySave(nextSave);
  }

  function chooseDifficulty(nextDifficulty: Difficulty) {
    setDifficulty(nextDifficulty);
    updateSave({ ...save, difficulty: nextDifficulty });
    setSolved(alreadySolvedToday);
  }

  function finishPuzzle(nextTiles: number[]) {
    setTiles(nextTiles);
    setSolved(true);
    setSparkles(true);
    window.setTimeout(() => setSparkles(false), 1800);

    if (save.sound) {
      chimeRef.current?.play().catch(() => {});
    }

    if (!alreadySolvedToday) {
      updateSave(awardSolvedDay(save, daily.puzzle.stickerId, daily.dateKey, daily.isSunday));
    }
  }

  function swapTiles(first: number, second: number) {
    const nextTiles = [...tiles];
    [nextTiles[first], nextTiles[second]] = [nextTiles[second], nextTiles[first]];
    setSelected(null);

    if (isSolved(nextTiles)) {
      finishPuzzle(nextTiles);
    } else {
      setTiles(nextTiles);
    }
  }

  function handleTilePress(index: number) {
    dismissTutorial();

    if (solved || peeking) return;

    if (selected === null) {
      setSelected(index);
      return;
    }

    if (selected === index) {
      setSelected(null);
      return;
    }

    swapTiles(selected, index);
  }

  function handleDragStart(event: DragEvent<HTMLButtonElement>, index: number) {
    event.dataTransfer.setData("text/plain", String(index));
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>, index: number) {
    event.preventDefault();
    const from = Number(event.dataTransfer.getData("text/plain"));
    if (!Number.isNaN(from) && from !== index && !solved) {
      swapTiles(from, index);
    }
  }

  function toggleSound() {
    updateSave({ ...save, sound: !save.sound });
  }

  function resetProgress() {
    if (!window.confirm("Start over and clear this sticker album on this device?")) return;
    resetPlaySave();
    const fresh = { ...defaultSave, difficulty };
    setSave(fresh);
    setSolved(false);
    setTiles(createShuffledTiles(tileCount, `${daily.puzzle.id}-${daily.dateKey}-${difficulty}-reset`));
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-5 px-3 pb-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_390px]">
      <section className="rounded-3xl border border-white/80 bg-cream/85 p-3 shadow-md backdrop-blur-md sm:p-7">
        <div className="mb-2 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="rounded-full bg-cream-deep px-3 py-1.5 text-xs font-semibold text-chestnut-soft sm:px-4 sm:py-2 sm:text-sm">
              Puzzle #{daily.dayIndex + 1}
            </span>
            <span className="rounded-full bg-gold/20 px-3 py-1.5 text-xs font-semibold text-chestnut-soft sm:px-4 sm:py-2 sm:text-sm">
              {daily.friendlyDate}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setShowTutorial(true)}
              className="min-h-9 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-chestnut-soft shadow-sm transition hover:bg-cream-deep focus:outline-none focus:ring-2 focus:ring-gold sm:min-h-11 sm:px-4 sm:py-2 sm:text-sm"
            >
              How to play
            </button>
            <button
              type="button"
              onClick={toggleSound}
              className="min-h-9 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-chestnut-soft shadow-sm transition hover:bg-cream-deep focus:outline-none focus:ring-2 focus:ring-gold sm:min-h-11 sm:px-4 sm:py-2 sm:text-sm"
              aria-pressed={save.sound}
            >
              {save.sound ? "Sound on" : "Sound off"}
            </button>
          </div>
        </div>

        <div className="mb-2 grid grid-cols-2 gap-1 rounded-full bg-white/50 p-1 sm:mb-4 sm:gap-3 sm:rounded-2xl sm:bg-transparent sm:p-0">
          {difficultyOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => chooseDifficulty(option.value)}
              className={
                difficulty === option.value
                  ? "min-h-9 rounded-full border-2 border-gold bg-gold/20 px-2 py-1.5 text-center shadow-sm sm:min-h-14 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-left"
                  : "min-h-9 rounded-full border border-white/80 bg-white/55 px-2 py-1.5 text-center transition hover:bg-white/80 sm:min-h-14 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-left"
              }
            >
              <span className="block font-display text-sm font-bold text-chestnut sm:text-lg">{option.label}</span>
              <span className="hidden text-[11px] font-semibold text-chestnut-soft sm:block sm:text-sm">{option.sublabel}</span>
            </button>
          ))}
        </div>

        <div className="relative mx-auto max-w-[560px]">
          <div
            className="grid aspect-square overflow-hidden rounded-3xl border-4 border-cream bg-cream-deep shadow-lg"
            style={{ gridTemplateColumns: `repeat(${grid}, minmax(0, 1fr))` }}
          >
            {!imageReady && (
              <div className="col-span-full grid h-full w-full place-items-center bg-cream-deep px-6 text-center">
                <div>
                  <p className="font-display text-lg font-bold text-chestnut-soft">
                    {imageFailed ? "Today's picture could not load." : "Loading today's picture..."}
                  </p>
                  {!imageFailed && (
                    <div className="mx-auto mt-4 h-2 w-28 overflow-hidden rounded-full bg-white/70">
                      <div className="h-full w-1/2 animate-pulse rounded-full bg-gold/80" />
                    </div>
                  )}
                </div>
              </div>
            )}
            {imageReady && tiles.map((tile, index) => {
              const row = Math.floor(tile / grid);
              const col = tile % grid;
              const correct = tile === index;

              return (
                <button
                  key={`${tile}-${index}`}
                  type="button"
                  draggable={!solved}
                  onDragStart={(event) => handleDragStart(event, index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleDrop(event, index)}
                  onClick={() => handleTilePress(index)}
                  className={
                    solved
                      ? "relative min-h-11 border-0 bg-cover bg-no-repeat transition-all duration-500"
                      : selected === index
                        ? "relative min-h-11 border border-cream bg-cover bg-no-repeat outline outline-4 outline-gold outline-offset-[-5px] transition"
                        : "relative min-h-11 border border-cream bg-cover bg-no-repeat transition hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-gold"
                  }
                  style={{
                    backgroundImage: `url(${daily.puzzle.image})`,
                    backgroundSize: `${grid * 100}% ${grid * 100}%`,
                    backgroundPosition: `${(col / (grid - 1)) * 100}% ${(row / (grid - 1)) * 100}%`,
                  }}
                  aria-label={`Puzzle piece ${index + 1}`}
                >
                  {showDots && correct && !solved && (
                    <span className="absolute right-2 top-2 h-3 w-3 rounded-full bg-sage shadow-sm" />
                  )}
                </button>
              );
            })}
          </div>

          {imageReady && (peeking || solved) && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl border-4 border-cream bg-cream-deep">
              <Image src={daily.puzzle.image} alt="" fill sizes="560px" className="object-cover" />
            </div>
          )}

          {imageReady && showTutorial && !solved && (
            <button
              type="button"
              onClick={dismissTutorial}
              className="absolute inset-0 grid place-items-center rounded-3xl bg-transparent"
              aria-label="Dismiss puzzle tutorial"
            >
              <span className="play-demo-hand" aria-hidden="true">
                Tap
              </span>
            </button>
          )}

          {sparkles && <div className="play-sparkles" aria-hidden="true" />}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-chestnut-soft">
            {selected === null
              ? "Tap two pieces to make them trade places. Finish the picture to win a sticker!"
              : "Now tap where it should go!"}
          </p>
          <div className="relative">
            {showPeekTip && (
              <span className="absolute bottom-full right-0 mb-2 w-44 rounded-2xl bg-chestnut px-3 py-2 text-xs font-semibold text-cream shadow-md">
                Hold to see the finished picture.
              </span>
            )}
            <button
              type="button"
              onMouseDown={() => {
                setPeeking(true);
                setShowPeekTip(false);
              }}
              onMouseUp={() => setPeeking(false)}
              onMouseLeave={() => setPeeking(false)}
              onTouchStart={() => {
                setPeeking(true);
                setShowPeekTip(false);
              }}
              onTouchEnd={() => setPeeking(false)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-cream shadow-md transition hover:bg-chestnut focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <span className="relative h-4 w-6 rounded-full border-2 border-cream" aria-hidden="true">
                <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream" />
              </span>
              Peek
            </button>
          </div>
        </div>

        <p className="mt-5 rounded-2xl bg-white/50 px-4 py-3 text-sm leading-relaxed text-chestnut-soft">
          Today&apos;s picture: {daily.puzzle.caption}
        </p>
      </section>

      <div className="space-y-6">
        {(solved || alreadySolvedToday) && (
          <RewardCard
            puzzle={daily.puzzle}
            sticker={sticker}
            tomorrowSticker={tomorrowSticker}
            golden={Boolean(save.earned[daily.puzzle.stickerId]?.golden || daily.isSunday)}
          />
        )}
        <StickerAlbum stickers={puzzleManifest.stickers} save={save} />
      </div>

      <div className="lg:col-span-2">
        <section className="rounded-3xl border border-white/80 bg-cream/85 p-5 text-center shadow-md backdrop-blur-md sm:p-7">
          <p className="font-display text-xl font-bold text-chestnut">For grown-ups</p>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-chestnut-soft">
            Get free printables that pair with the games - coloring pages, verse posters, and more.
          </p>
          <a
            href="/#books"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-cream shadow-md transition hover:scale-[1.02] hover:bg-chestnut"
          >
            See the book collection
          </a>
        </section>

        <div className="mt-6 text-center text-xs font-semibold text-chestnut-soft/80">
          <p>Stickers are saved on this device. No account needed - nothing is collected.</p>
          <button type="button" onClick={resetProgress} className="mt-3 underline underline-offset-4">
            Start over
          </button>
        </div>
      </div>

      <audio ref={chimeRef} src="/sounds/bird.mp3" preload="none" />
    </div>
  );
}
