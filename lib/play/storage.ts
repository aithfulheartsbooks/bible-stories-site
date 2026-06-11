import type { Difficulty } from "./rotation";
import { PLAY_STORAGE_KEY } from "./config";

export type EarnedSticker = {
  date: string;
  golden: boolean;
};

export type PlaySave = {
  version: 2;
  earned: Record<string, EarnedSticker>;
  solvedActivities: Record<string, string[]>;
  playedDates: string[];
  practiceStars: number;
  lastSolvedDate?: string;
  currentStreak: number;
  bestStreak: number;
  totalSolved: number;
  difficulty: Difficulty;
  sound: boolean;
};

export const defaultSave: PlaySave = {
  version: 2,
  earned: {},
  solvedActivities: {},
  playedDates: [],
  practiceStars: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalSolved: 0,
  difficulty: "2x2",
  sound: false,
};

function unique(items: string[]) {
  return [...new Set(items)];
}

function todayDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeCurrentStreak(save: PlaySave) {
  if (!save.lastSolvedDate || save.currentStreak <= 0) return save;

  const today = todayDateKey();
  const yesterday = addDays(today, -1);
  if (save.lastSolvedDate === today || save.lastSolvedDate === yesterday) return save;

  return { ...save, currentStreak: 0 };
}

export function readPlaySave(): PlaySave {
  try {
    const raw = window.localStorage.getItem(PLAY_STORAGE_KEY);
    if (!raw) return defaultSave;

    const parsed = JSON.parse(raw) as Partial<PlaySave>;
    return normalizeCurrentStreak({
      ...defaultSave,
      ...parsed,
      version: 2,
      earned: parsed.earned || {},
      solvedActivities: parsed.solvedActivities || {},
      playedDates: unique(parsed.playedDates || (parsed.lastSolvedDate ? [parsed.lastSolvedDate] : [])),
      practiceStars: Number(parsed.practiceStars || 0),
      difficulty: parsed.difficulty === "3x3" ? "3x3" : "2x2",
      sound: Boolean(parsed.sound),
    });
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

export function hasSolvedActivity(save: PlaySave, dateKey: string, activityKey: string) {
  return Boolean(save.solvedActivities[dateKey]?.includes(activityKey));
}

export function hasSolvedAnyToday(save: PlaySave, dateKey: string) {
  return Boolean(save.solvedActivities[dateKey]?.length || save.lastSolvedDate === dateKey);
}

export function awardDailyActivity(
  save: PlaySave,
  activityKey: string,
  stickerId: string,
  dateKey: string,
  golden: boolean
): PlaySave {
  const solvedForDay = save.solvedActivities[dateKey] || [];
  if (solvedForDay.includes(activityKey)) return save;

  const firstSolveForDay = !hasSolvedAnyToday(save, dateKey);
  const yesterday = addDays(dateKey, -1);
  const nextStreak = firstSolveForDay
    ? save.lastSolvedDate === yesterday
      ? save.currentStreak + 1
      : 1
    : save.currentStreak;

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
    solvedActivities: {
      ...save.solvedActivities,
      [dateKey]: [...solvedForDay, activityKey],
    },
    playedDates: unique([...save.playedDates, dateKey]),
    lastSolvedDate: dateKey,
    currentStreak: nextStreak,
    bestStreak: Math.max(save.bestStreak, nextStreak),
    totalSolved: save.totalSolved + 1,
  };
}

export function awardPracticeStar(save: PlaySave): PlaySave {
  return {
    ...save,
    practiceStars: save.practiceStars + 1,
  };
}

// TODO(v2): Add "Save my album" export/import codes for earned stickers with no personal data.
