// Measured by `python scripts/align-songs.py --catalog`.
// `line` is the printed-line index (labels are not lines), matching the
// lines passed to the script. A cue's start is that match's first word time.

export const SUNG_LINE_SCORE = 0.6;

export const SUNG_LINE_FIX =
  "the video doesn't sing this printed line: swap the video or re-run scripts/align-songs.py";

export type AlignmentCue = {
  line: number;
  start: number;
  score: number;
};

export type SongAlignment = {
  videoId: string;
  duration: number;
  cues: AlignmentCue[];
};

export function checkSungLines(
  slug: string,
  videoId: string,
  lines: readonly string[],
  alignment: SongAlignment | undefined,
): void {
  if (!alignment || alignment.videoId !== videoId) {
    const found = alignment?.videoId ?? "(none)";
    throw new Error(
      `${slug}: alignment manifest video id ${found} does not match ${videoId}. Re-run scripts/align-songs.py.`,
    );
  }
  const best = new Map<number, number>();
  for (const cue of alignment.cues) {
    if (!Number.isInteger(cue.line) || cue.line < 0 || cue.line >= lines.length) continue;
    best.set(cue.line, Math.max(best.get(cue.line) ?? 0, cue.score));
  }
  const unsung = lines.filter((line, index) => (best.get(index) ?? 0) < SUNG_LINE_SCORE);
  if (unsung.length > 0) {
    const quoted = unsung.map((line) => JSON.stringify(line)).join("; ");
    throw new Error(`${slug}: ${SUNG_LINE_FIX} Unsung: ${quoted}`);
  }
}
