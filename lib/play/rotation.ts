import manifest from "@/data/puzzles.json";
import { PLAY_ROTATION_SEED } from "./config";

export type Difficulty = "2x2" | "3x3";
export type ActivityType = "puzzle" | "hiddenObject" | "memoryMatch";

export type Puzzle = {
  id: string;
  activityType: ActivityType;
  bookNumber: number;
  bookTitle: string;
  image: string;
  amazonUrl: string;
  coloringPageUrl?: string;
  stickerId: string;
  stickerIds?: string[];
  caption: string;
};

export type Sticker = {
  id: string;
  name: string;
  image: string;
  bookNumber: number;
  bookTitle?: string;
  bookId?: string;
  bookUrl?: string;
  amazonUrl?: string;
  rarity: "common" | "golden";
};

export type PuzzleManifest = {
  launchDate: string;
  puzzles: Puzzle[];
  dateOverrides: Record<string, string>;
  stickers: Sticker[];
};

export type DailyActivity = {
  activity: Puzzle;
  activityKey: string;
  sticker?: Sticker;
  dayIndex: number;
  dateKey: string;
  friendlyDate: string;
  isSunday: boolean;
  slotNumber: number;
};

export const puzzleManifest = manifest as PuzzleManifest;

const DAY_MS = 86400000;
const DAILY_ACTIVITY_COUNT = 3;

export function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function monthDayKey(date: Date) {
  return localDateKey(date).slice(5);
}

function localMidnight(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function seededRandom(seed: number) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;

  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function getFriendlyDate(date: Date) {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function seededShuffle<T>(items: T[], seed = PLAY_ROTATION_SEED) {
  const shuffled = [...items];
  const random = seededRandom(seed);

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

export function getSticker(stickerId: string, data = puzzleManifest) {
  return data.stickers.find((sticker) => sticker.id === stickerId);
}

function getRotationIndex(date: Date, data = puzzleManifest) {
  const launch = new Date(`${data.launchDate}T00:00:00`);
  const rawDayIndex = Math.floor((localMidnight(date) - localMidnight(launch)) / DAY_MS);
  return Math.max(0, rawDayIndex);
}

function getActivitySticker(activity: Puzzle, rotationSlot: number, data = puzzleManifest) {
  const stickerIds = activity.stickerIds?.length ? activity.stickerIds : [activity.stickerId];
  const cycle = Math.floor(rotationSlot / Math.max(1, data.puzzles.length));
  return getSticker(stickerIds[cycle % stickerIds.length], data);
}

export function getDailyActivities(date = new Date(), data = puzzleManifest): DailyActivity[] {
  const dayIndex = getRotationIndex(date, data);
  const dateKey = localDateKey(date);
  const overrideId = data.dateOverrides[dateKey] || data.dateOverrides[monthDayKey(date)];
  const rotationPool = seededShuffle(data.puzzles);
  const friendlyDate = getFriendlyDate(date);
  const isSunday = date.getDay() === 0;

  return Array.from({ length: DAILY_ACTIVITY_COUNT }, (_, index) => {
    const rotationSlot = dayIndex * DAILY_ACTIVITY_COUNT + index;
    const fallback = rotationPool[rotationSlot % rotationPool.length] || data.puzzles[0];
    const activity =
      index === 0 && overrideId
        ? data.puzzles.find((item) => item.id === overrideId) || fallback
        : fallback;
    const sticker = getActivitySticker(activity, rotationSlot, data);

    return {
      activity,
      activityKey: `${dateKey}:${activity.id}:${index}`,
      sticker,
      dayIndex,
      dateKey,
      friendlyDate,
      isSunday,
      slotNumber: index + 1,
    };
  });
}

export function getDailyPuzzle(date = new Date(), data = puzzleManifest) {
  const [firstActivity] = getDailyActivities(date, data);

  return {
    puzzle: firstActivity.activity,
    dayIndex: firstActivity.dayIndex,
    dateKey: firstActivity.dateKey,
    isSunday: firstActivity.isSunday,
    friendlyDate: firstActivity.friendlyDate,
  };
}

export function getTomorrowSticker(date = new Date(), data = puzzleManifest) {
  const tomorrow = new Date(date);
  tomorrow.setDate(date.getDate() + 1);
  return getDailyActivities(tomorrow, data)[0]?.sticker;
}

export function getPracticeActivities(date = new Date(), playedDates: string[], data = puzzleManifest) {
  const todayKey = localDateKey(date);
  const priorDates = [...new Set(playedDates)]
    .filter((dateKey) => dateKey < todayKey)
    .sort()
    .slice(-14);
  const unlocked = priorDates.flatMap((dateKey) => getDailyActivities(new Date(`${dateKey}T00:00:00`), data));

  if (unlocked.length > 0) return unlocked;

  const launch = new Date(`${data.launchDate}T00:00:00`);
  return getDailyActivities(launch, data);
}

export function createShuffledTiles(tileCount: number, seedText: string) {
  const seed = [...seedText].reduce((sum, char) => sum + char.charCodeAt(0), PLAY_ROTATION_SEED);
  const tiles = seededShuffle(
    Array.from({ length: tileCount }, (_, index) => index),
    seed
  );

  if (tiles.every((tile, index) => tile === index) && tiles.length > 1) {
    [tiles[0], tiles[1]] = [tiles[1], tiles[0]];
  }

  return tiles;
}

export function isSolved(tiles: number[]) {
  return tiles.every((tile, index) => tile === index);
}
