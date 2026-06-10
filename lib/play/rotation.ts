import manifest from "@/data/puzzles.json";
import { PLAY_ROTATION_SEED } from "./config";

export type Difficulty = "2x2" | "3x3";

export type Puzzle = {
  id: string;
  bookNumber: number;
  bookTitle: string;
  image: string;
  amazonUrl: string;
  coloringPageUrl?: string;
  stickerId: string;
  caption: string;
};

export type Sticker = {
  id: string;
  name: string;
  image: string;
  bookNumber: number;
  rarity: "common" | "golden";
};

export type PuzzleManifest = {
  launchDate: string;
  puzzles: Puzzle[];
  dateOverrides: Record<string, string>;
  stickers: Sticker[];
};

export const puzzleManifest = manifest as PuzzleManifest;

const DAY_MS = 86400000;

function localDateKey(date: Date) {
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

export function seededShuffle<T>(items: T[], seed = PLAY_ROTATION_SEED) {
  const shuffled = [...items];
  const random = seededRandom(seed);

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

export function getDailyPuzzle(date = new Date(), data = puzzleManifest) {
  const launch = new Date(`${data.launchDate}T00:00:00`);
  const rawDayIndex = Math.floor((localMidnight(date) - localMidnight(launch)) / DAY_MS);
  const dayIndex = Math.max(0, rawDayIndex);
  const dateKey = localDateKey(date);
  const overrideId = data.dateOverrides[dateKey] || data.dateOverrides[monthDayKey(date)];
  const shuffled = seededShuffle(data.puzzles);
  const fallback = shuffled[dayIndex % shuffled.length] || data.puzzles[0];
  const puzzle = data.puzzles.find((item) => item.id === overrideId) || fallback;

  return {
    puzzle,
    dayIndex,
    dateKey,
    isSunday: date.getDay() === 0,
    friendlyDate: date.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    }),
  };
}

export function getSticker(stickerId: string, data = puzzleManifest) {
  return data.stickers.find((sticker) => sticker.id === stickerId);
}

export function getTomorrowSticker(date = new Date(), data = puzzleManifest) {
  const tomorrow = new Date(date);
  tomorrow.setDate(date.getDate() + 1);
  return getSticker(getDailyPuzzle(tomorrow, data).puzzle.stickerId, data);
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
