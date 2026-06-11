"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import Image from "next/image";
import StickerAlbum from "./StickerAlbum";
import RewardCard from "./RewardCard";
import {
  createShuffledTiles,
  getDailyActivities,
  getPracticeActivities,
  getTomorrowSticker,
  isSolved,
  puzzleManifest,
  type DailyActivity,
  type Difficulty,
} from "@/lib/play/rotation";
import {
  awardDailyActivity,
  awardPracticeStar,
  defaultSave,
  hasSolvedActivity,
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

type PlayMode = "daily" | "practice";

type AudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

const angelSpots = [
  "left-4 top-24 sm:left-8 sm:top-28",
  "right-5 top-28 sm:right-10 sm:top-32",
  "left-5 top-[34rem] sm:left-8 sm:top-[33rem]",
  "right-6 top-[31rem] sm:right-12 sm:top-[34rem]",
  "left-1/2 top-20 -translate-x-1/2",
  "left-4 bottom-28 sm:left-10 sm:bottom-32",
  "right-4 bottom-36 sm:right-10 sm:bottom-40",
  "left-1/2 bottom-24 -translate-x-1/2",
];

function getPuzzleThumbnailSrc(src: string) {
  return src.replace("/play/puzzles/drive/", "/play/puzzles/thumbs/");
}

function getNewStoriesCountdown(now = new Date()) {
  const midnight = new Date(now);
  midnight.setDate(now.getDate() + 1);
  midnight.setHours(0, 0, 0, 0);

  const remainingMinutes = Math.max(0, Math.ceil((midnight.getTime() - now.getTime()) / 60000));
  const hours = Math.floor(remainingMinutes / 60);
  const minutes = remainingMinutes % 60;

  return `${hours}h ${minutes}m`;
}

export default function DailyPuzzle() {
  const [dailyActivities, setDailyActivities] = useState(() => getDailyActivities(new Date()));
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState<PlayMode>("daily");
  const [practiceActivity, setPracticeActivity] = useState<DailyActivity | null>(null);
  const [rewardActivity, setRewardActivity] = useState<DailyActivity | null>(null);
  const [rewardMode, setRewardMode] = useState<PlayMode>("daily");
  const [save, setSave] = useState<PlaySave>(defaultSave);
  const [hasLoadedSave, setHasLoadedSave] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("2x2");
  const [tiles, setTiles] = useState<number[]>(() =>
    createShuffledTiles(4, `${dailyActivities[0].activityKey}-2x2`)
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [peeking, setPeeking] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showPeekTip, setShowPeekTip] = useState(true);
  const [sparkles, setSparkles] = useState(false);
  const [flyingSticker, setFlyingSticker] = useState<{ image: string; name: string } | null>(null);
  const [newStoriesIn, setNewStoriesIn] = useState(() => getNewStoriesCountdown());
  const [angelWiggle, setAngelWiggle] = useState(false);
  const chimeRef = useRef<HTMLAudioElement | null>(null);

  const activeDailyActivity = dailyActivities[activeIndex] || dailyActivities[0];
  const currentActivity = mode === "practice" && practiceActivity ? practiceActivity : activeDailyActivity;
  const puzzle = currentActivity.activity;
  const currentSticker = mode === "daily" ? currentActivity.sticker : undefined;
  const grid = difficulty === "2x2" ? 2 : 3;
  const tileCount = grid * grid;
  const alreadySolvedCurrent =
    mode === "daily" && hasSolvedActivity(save, currentActivity.dateKey, currentActivity.activityKey);
  const boardSolved = solved || alreadySolvedCurrent;
  const allDailySolved = dailyActivities.every((activity) =>
    hasSolvedActivity(save, activity.dateKey, activity.activityKey)
  );
  const tomorrowSticker = getTomorrowSticker(new Date());
  const showDots = SHOW_CORRECT_DOTS[difficulty];
  const hiddenAngelSpot = angelSpots[activeDailyActivity.dayIndex % angelSpots.length];
  const dailyMemoryVerse =
    dailyActivities.find((activity) => activity.activity.memoryVerse)?.activity.memoryVerse ||
    "The Lord is good to all. - Psalm 145:9";

  useEffect(() => {
    const nextActivities = getDailyActivities(new Date());
    setDailyActivities(nextActivities);
    setActiveIndex(0);
    setMode("daily");
    setPracticeActivity(null);
    setRewardActivity(null);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const nextActivities = getDailyActivities(new Date());
      setDailyActivities((currentActivities) =>
        currentActivities[0]?.dateKey === nextActivities[0]?.dateKey ? currentActivities : nextActivities
      );
      setNewStoriesIn(getNewStoriesCountdown());
    }, 60000);

    setNewStoriesIn(getNewStoriesCountdown());
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
    image.src = puzzle.image;

    if (image.complete && image.naturalWidth > 0) {
      setImageReady(true);
    }

    return () => {
      active = false;
    };
  }, [puzzle.image]);

  useEffect(() => {
    const stored = readPlaySave();
    setSave(stored);
    setDifficulty(stored.difficulty);
    setSolved(false);
    setHasLoadedSave(true);

    try {
      setShowTutorial(window.localStorage.getItem(PLAY_TUTORIAL_KEY) !== "true");
    } catch {
      setShowTutorial(true);
    }
  }, [activeDailyActivity.dateKey]);

  useEffect(() => {
    if (!hasLoadedSave) return;

    setTiles(
      boardSolved
        ? Array.from({ length: tileCount }, (_, index) => index)
        : createShuffledTiles(tileCount, `${currentActivity.activityKey}-${difficulty}`)
    );
    setSelected(null);
  }, [boardSolved, currentActivity.activityKey, difficulty, hasLoadedSave, tileCount]);

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

  function playTone(kind: "pop" | "ding" | "giggle") {
    if (!save.sound || typeof window === "undefined") return;

    const audioWindow = window as AudioWindow;
    const AudioContextClass = audioWindow.AudioContext || audioWindow.webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const gain = context.createGain();
    gain.connect(context.destination);

    const tones =
      kind === "giggle"
        ? [620, 780, 660]
        : kind === "ding"
          ? [760, 980]
          : [240];

    tones.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = kind === "pop" ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(frequency, context.currentTime + index * 0.075);
      oscillator.connect(gain);
      oscillator.start(context.currentTime + index * 0.075);
      oscillator.stop(context.currentTime + index * 0.075 + (kind === "pop" ? 0.08 : 0.12));
    });

    gain.gain.setValueAtTime(kind === "pop" ? 0.045 : 0.035, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.36);
    window.setTimeout(() => context.close().catch(() => {}), 520);
  }

  function chooseDifficulty(nextDifficulty: Difficulty) {
    setDifficulty(nextDifficulty);
    updateSave({ ...save, difficulty: nextDifficulty });
    setSolved(false);
  }

  function chooseDailyActivity(index: number) {
    setMode("daily");
    setPracticeActivity(null);
    setActiveIndex(index);
    setSolved(false);
    setRewardActivity(dailyActivities[index]);
    setRewardMode("daily");
  }

  function startPractice() {
    const practicePool = getPracticeActivities(new Date(), save.playedDates);
    const nextPractice = practicePool[save.practiceStars % practicePool.length];
    setMode("practice");
    setPracticeActivity(nextPractice);
    setRewardActivity(null);
    setRewardMode("practice");
    setSolved(false);
  }

  function finishPuzzle(nextTiles: number[]) {
    setTiles(nextTiles);
    setSolved(true);
    setSparkles(true);
    setRewardActivity(currentActivity);
    setRewardMode(mode);
    window.setTimeout(() => setSparkles(false), 1800);

    if (save.sound) {
      chimeRef.current?.play().catch(() => {});
    }

    if (mode === "practice") {
      updateSave(awardPracticeStar(save));
      return;
    }

    if (currentSticker && !alreadySolvedCurrent) {
      updateSave(
        awardDailyActivity(
          save,
          currentActivity.activityKey,
          currentSticker.id,
          currentActivity.dateKey,
          currentActivity.isSunday
        )
      );
    }
  }

  function swapTiles(first: number, second: number) {
    const nextTiles = [...tiles];
    [nextTiles[first], nextTiles[second]] = [nextTiles[second], nextTiles[first]];
    setSelected(null);
    playTone("pop");

    const landedCorrectly = nextTiles[first] === first || nextTiles[second] === second;
    if (landedCorrectly) {
      window.setTimeout(() => playTone("ding"), 95);
    }

    if (isSolved(nextTiles)) {
      finishPuzzle(nextTiles);
    } else {
      setTiles(nextTiles);
    }
  }

  function handleTilePress(index: number) {
    dismissTutorial();

    if (boardSolved || peeking) return;

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
    if (!Number.isNaN(from) && from !== index && !boardSolved) {
      swapTiles(from, index);
    }
  }

  function toggleSound() {
    updateSave({ ...save, sound: !save.sound });
  }

  function tapAngel() {
    setAngelWiggle(true);
    playTone("giggle");
    window.setTimeout(() => setAngelWiggle(false), 650);
  }

  function revealFlyingSticker(sticker?: { image: string; name: string }) {
    if (!sticker) return;
    setFlyingSticker({ image: sticker.image, name: sticker.name });
    window.setTimeout(() => setFlyingSticker(null), 1200);
  }

  function resetProgress() {
    if (!window.confirm("Start over and clear this sticker album on this device?")) return;
    resetPlaySave();
    const fresh = { ...defaultSave, difficulty };
    setSave(fresh);
    setSolved(false);
    setMode("daily");
    setPracticeActivity(null);
    setRewardActivity(null);
    setTiles(createShuffledTiles(tileCount, `${currentActivity.activityKey}-${difficulty}-reset`));
  }

  return (
    <div className="relative mx-auto grid max-w-7xl gap-5 px-3 pb-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_390px]">
      <button
        type="button"
        onClick={tapAngel}
        className={`play-hidden-angel absolute z-20 h-12 w-12 overflow-hidden rounded-full border-2 border-cream bg-white/85 shadow-md transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold sm:h-14 sm:w-14 ${hiddenAngelSpot} ${
          angelWiggle ? "play-angel-wiggle" : ""
        }`}
        aria-label="Hidden Angel"
      >
        <Image src="/Faith_Rivers.png" alt="" fill sizes="56px" className="scale-[2.7] object-cover object-top" />
      </button>

      <section className="rounded-3xl border border-white/80 bg-cream/85 p-3 shadow-md backdrop-blur-md sm:p-6">
        <div className="mb-2 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="rounded-full bg-cream-deep px-3 py-1.5 text-xs font-semibold text-chestnut-soft sm:px-4 sm:py-2 sm:text-sm">
              Today&apos;s three stories
            </span>
            <span className="rounded-full bg-gold/20 px-3 py-1.5 text-xs font-semibold text-chestnut-soft sm:px-4 sm:py-2 sm:text-sm">
              {activeDailyActivity.friendlyDate}
            </span>
            {allDailySolved && (
              <span className="rounded-full bg-white/75 px-3 py-1.5 text-xs font-bold text-terracotta sm:px-4 sm:py-2 sm:text-sm">
                {"\u2726 \u2726 \u2726"}
              </span>
            )}
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

        <div className="mb-3 grid grid-cols-3 gap-2">
          {dailyActivities.map((activity, index) => {
            const isActive = mode === "daily" && activeIndex === index;
            const isComplete = hasSolvedActivity(save, activity.dateKey, activity.activityKey);

            return (
              <button
                key={activity.activityKey}
                type="button"
                onClick={() => chooseDailyActivity(index)}
                className={
                  isActive
                    ? "relative min-h-[5.4rem] overflow-hidden rounded-2xl border-2 border-gold bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    : "relative min-h-[5.4rem] overflow-hidden rounded-2xl border border-white/80 bg-white/60 shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-gold"
                }
              >
                <Image
                  src={
                    isComplete && activity.sticker
                      ? activity.sticker.image
                      : getPuzzleThumbnailSrc(activity.activity.image)
                  }
                  alt=""
                  fill
                  sizes="(max-width: 640px) 33vw, 160px"
                  className={isComplete ? "object-cover" : "scale-110 object-cover blur-[2px] brightness-90"}
                />
                <span className="absolute inset-0 bg-gradient-to-t from-chestnut/55 via-chestnut/10 to-transparent" />
                <span className="absolute inset-x-2 bottom-2 text-left text-[11px] font-bold leading-tight text-cream sm:text-xs">
                  {isComplete ? "Done" : activity.activity.bookTitle}
                </span>
                {isComplete && (
                  <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-gold text-sm font-black text-chestnut">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mb-2 grid grid-cols-2 gap-1 rounded-full bg-white/50 p-1 sm:mb-4">
          {difficultyOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => chooseDifficulty(option.value)}
              className={
                difficulty === option.value
                  ? "min-h-9 rounded-full border-2 border-gold bg-gold/20 px-2 py-1.5 text-center shadow-sm sm:min-h-12 sm:px-4 sm:py-2"
                  : "min-h-9 rounded-full border border-white/80 bg-white/55 px-2 py-1.5 text-center transition hover:bg-white/80 sm:min-h-12 sm:px-4 sm:py-2"
              }
            >
              <span className="block font-display text-sm font-bold text-chestnut sm:text-base">{option.label}</span>
              <span className="hidden text-[11px] font-semibold text-chestnut-soft sm:block">{option.sublabel}</span>
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
            {imageReady &&
              tiles.map((tile, index) => {
                const row = Math.floor(tile / grid);
                const col = tile % grid;
                const correct = tile === index;

                return (
                  <button
                    key={`${tile}-${index}`}
                    type="button"
                    draggable={!boardSolved}
                    onDragStart={(event) => handleDragStart(event, index)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => handleDrop(event, index)}
                    onClick={() => handleTilePress(index)}
                    className={
                      boardSolved
                        ? "relative min-h-11 border-0 bg-cover bg-no-repeat transition-all duration-500"
                        : selected === index
                          ? "relative min-h-11 border border-cream bg-cover bg-no-repeat outline outline-4 outline-gold outline-offset-[-5px] transition"
                          : "relative min-h-11 border border-cream bg-cover bg-no-repeat transition hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-gold"
                    }
                    style={{
                      backgroundImage: `url(${puzzle.image})`,
                      backgroundSize: `${grid * 100}% ${grid * 100}%`,
                      backgroundPosition: `${(col / (grid - 1)) * 100}% ${(row / (grid - 1)) * 100}%`,
                    }}
                    aria-label={`Puzzle piece ${index + 1}`}
                  >
                    {showDots && correct && !boardSolved && (
                      <span className="absolute right-2 top-2 h-3 w-3 rounded-full bg-sage shadow-sm" />
                    )}
                  </button>
                );
              })}
          </div>

          {imageReady && peeking && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl border-4 border-cream bg-cream-deep">
              <Image src={puzzle.image} alt="" fill sizes="560px" className="object-cover" />
            </div>
          )}

          {imageReady && showTutorial && !boardSolved && (
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
            {mode === "practice"
              ? "Practice puzzles give stars. Daily puzzles give stickers."
              : selected === null
                ? "Tap two pieces to make them trade places. Finish the picture to win this sticker!"
                : "Now tap where it should go!"}
          </p>
          <div className="relative">
            {showPeekTip && !boardSolved && (
              <span className="absolute bottom-full right-0 mb-2 hidden w-44 rounded-2xl bg-chestnut px-3 py-2 text-xs font-semibold text-cream shadow-md sm:block">
                Hold to see the finished picture.
              </span>
            )}
            <button
              type="button"
              disabled={boardSolved}
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
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-cream shadow-md transition hover:bg-chestnut focus:outline-none focus:ring-2 focus:ring-gold disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="relative h-4 w-6 rounded-full border-2 border-cream" aria-hidden="true">
                <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream" />
              </span>
              Peek
            </button>
          </div>
        </div>

        <p className="mt-5 rounded-2xl bg-white/50 px-4 py-3 text-sm leading-relaxed text-chestnut-soft">
          {mode === "practice" ? "Practice picture" : `Story ${currentActivity.slotNumber}`}: {puzzle.caption}
        </p>
      </section>

      <div className="space-y-6">
        {(rewardActivity || alreadySolvedCurrent) && (
          <RewardCard
            puzzle={(rewardActivity || currentActivity).activity}
            sticker={rewardMode === "daily" ? (rewardActivity || currentActivity).sticker : undefined}
            tomorrowSticker={tomorrowSticker}
            golden={Boolean(
              rewardMode === "daily" &&
                (rewardActivity || currentActivity).sticker &&
                (save.earned[(rewardActivity || currentActivity).sticker!.id]?.golden ||
                  (rewardActivity || currentActivity).isSunday)
            )}
            mode={rewardMode}
            allDailySolved={allDailySolved}
            newStoriesIn={newStoriesIn}
            memoryVerse={dailyMemoryVerse}
            onPractice={allDailySolved ? startPractice : undefined}
            onStickerReveal={() =>
              revealFlyingSticker(rewardMode === "daily" ? (rewardActivity || currentActivity).sticker : undefined)
            }
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

      {flyingSticker && (
        <div className="play-sticker-flight fixed z-[60] h-20 w-20 overflow-hidden rounded-full border-4 border-cream bg-white shadow-xl">
          <Image src={flyingSticker.image} alt={flyingSticker.name} fill sizes="80px" className="object-cover" />
        </div>
      )}
    </div>
  );
}
