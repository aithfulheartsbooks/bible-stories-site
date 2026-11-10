import type { LyricCue } from "@/lib/songs";

/** How long one printed line usually lasts in this cue list, in seconds. */
export function typicalLineSeconds(cues: readonly LyricCue[]): number {
  const gaps: number[] = [];
  for (let index = 1; index < cues.length; index += 1) {
    const gap = cues[index].start - cues[index - 1].start;
    if (gap > 0 && gap <= 12) gaps.push(gap);
  }
  if (gaps.length === 0) {
    for (let index = 1; index < cues.length; index += 1) {
      const gap = cues[index].start - cues[index - 1].start;
      if (gap > 0) gaps.push(gap);
    }
  }
  if (gaps.length === 0) return 8;
  gaps.sort((a, b) => a - b);
  return gaps[Math.floor((gaps.length - 1) / 2)];
}

/**
 * Printed line being sung at `time`, or null when no cue covers that moment.
 * A cue lasts until the next cue, but not longer than a line and a half.
 * A longer gap — an unprinted verse, a missing line, or the outro — clears
 * the highlight instead of leaving the previous line lit. The same printed
 * line can become active again when a later cue repeats it.
 */
export function activeLyricLine(cues: readonly LyricCue[], time: number): number | null {
  if (cues.length === 0 || !Number.isFinite(time)) return null;
  const ordered =
    cues.some((cue, index) => index > 0 && cue.start < cues[index - 1].start)
      ? [...cues].sort((a, b) => a.start - b.start)
      : cues;
  const hold = typicalLineSeconds(ordered) * 1.5;
  for (let index = ordered.length - 1; index >= 0; index -= 1) {
    const cue = ordered[index];
    if (time < cue.start) continue;
    const nextStart = ordered[index + 1]?.start;
    const end = nextStart == null ? cue.start + hold : Math.min(nextStart, cue.start + hold);
    return time < end ? cue.line : null;
  }
  return null;
}
