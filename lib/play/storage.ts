import type { Difficulty } from "./rotation";
import { PLAY_STORAGE_KEY } from "./config";

export type EarnedSticker = {
  date: string;
  golden: boolean;
};

export type PlaySave = {
  version: 1;
  earned: Record<string, EarnedSticker>;
  lastSolvedDate?: string;
  currentStreak: number;
  bestStreak: number;
  totalSolved: number;
  difficulty: Difficulty;
  sound: boolean;
};

export const defaultSave: PlaySave = {
  version: 1,
  earned: {},
  currentStreak: 0,
  bestStreak: 0,
  totalSolved: 0,
  difficulty: "2x2",
  sound: false,
};

export function readPlaySave(): PlaySave {
  try {
    const raw = window.localStorage.getItem(PLAY_STORAGE_KEY);
    if (!raw) return defaultSave;

    const parsed = JSON.parse(raw) as Partial<PlaySave>;
    return {
      ...defaultSave,
      ...parsed,
      version: 1,
      earned: parsed.earned || {},
      difficulty: parsed.difficulty === "3x3" ? "3x3" : "2x2",
      sound: Boolean(parsed.sound),
    };
  } catch {
    return defaultSave;
  }
}

export function writePlaySave(save: PlaySave) {
  try {
    window.localStorage.setItem(PLAY_STORAGE_KEY, JSON.stringify(save));
  } catch {
    // Private browsing can block storage. The game remains playable.
  }
}

export function resetPlaySave() {
  try {
    window.localStorage.removeItem(PLAY_STORAGE_KEY);
  } catch {
    // Storage may be unavailable.
  }
}

export function addDays(dateKey: string, days: number) {
  const date = new Date(`${dateKey}T00:00:00`);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function awardSolvedDay(
  save: PlaySave,
  stickerId: string,
  dateKey: string,
  golden: boolean
): PlaySave {
  const alreadySolvedToday = save.lastSolvedDate === dateKey;
  const yesterday = addDays(dateKey, -1);
  const nextStreak = alreadySolvedToday
    ? save.currentStreak
    : save.lastSolvedDate === yesterday
      ? save.currentStreak + 1
      : 1;

  const earned = {
    ...save.earned,
    [stickerId]: save.earned[stickerId]
      ? { ...save.earned[stickerId], golden: save.earned[stickerId].golden || golden }
      : { date: dateKey, golden },
  };

  if (nextStreak >= 3) {
    earned["golden-star-3"] = earned["golden-star-3"] || { date: dateKey, golden: true };
  }

  if (nextStreak >= 7) {
    earned["golden-star-7"] = earned["golden-star-7"] || { date: dateKey, golden: true };
  }

  return {
    ...save,
    earned,
    lastSolvedDate: dateKey,
    currentStreak: nextStreak,
    bestStreak: Math.max(save.bestStreak, nextStreak),
    totalSolved: alreadySolvedToday ? save.totalSolved : save.totalSolved + 1,
  };
}
