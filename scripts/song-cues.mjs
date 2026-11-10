#!/usr/bin/env node
/**
 * Fetch timed lyrics for one YouTube video. Does not guess.
 *
 *   node scripts/song-cues.mjs <videoId>
 *
 * Prints JSON: { videoId, duration, segments: [{ start, text }] }
 * Map those segments onto the printed lines in lib/songs.ts as
 *   cues: [{ line, start }, ...]
 * and set videoDuration. A line index may appear more than once
 * when the recording repeats it. If this script exits with an error,
 * leave cues off that song so the words stay static.
 */
import { execFile } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const videoId = process.argv[2];

if (!videoId || process.argv.length !== 3) {
  console.error("Usage: node scripts/song-cues.mjs <videoId>");
  process.exit(1);
}

function segmentsFromJson3(raw) {
  const data = JSON.parse(raw);
  const segments = [];
  for (const event of data.events ?? []) {
    if (typeof event.tStartMs !== "number") continue;
    const text = (event.segs ?? [])
      .map((seg) => seg.utf8 ?? "")
      .join("")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) continue;
    segments.push({ start: Math.round(event.tStartMs) / 1000, text });
  }
  return segments;
}

async function fromTimedText() {
  const listUrl = `https://www.youtube.com/api/timedtext?type=list&v=${encodeURIComponent(videoId)}`;
  const list = await fetch(listUrl);
  const xml = await list.text();
  const lang = xml.match(/lang_code="([a-zA-Z-]+)"/)?.[1];
  if (!lang) return null;
  const trackUrl = `https://www.youtube.com/api/timedtext?v=${encodeURIComponent(videoId)}&lang=${encodeURIComponent(lang)}&fmt=json3`;
  const track = await fetch(trackUrl);
  const body = await track.text();
  if (!body.trim().startsWith("{")) return null;
  const segments = segmentsFromJson3(body);
  return segments.length ? segments : null;
}

async function fromYtDlp() {
  const dir = await mkdtemp(path.join(tmpdir(), "song-cues-"));
  try {
    const { stdout } = await execFileAsync(
      "yt-dlp",
      [
        "--skip-download",
        "--write-auto-sub",
        "--write-sub",
        "--sub-langs",
        "en.*",
        "--sub-format",
        "json3",
        "--print",
        "%(duration)s",
        "-o",
        path.join(dir, "%(id)s"),
        `https://www.youtube.com/watch?v=${videoId}`,
      ],
      { timeout: 45000 },
    );
    const duration = Number(String(stdout).trim().split("\n").pop());
    const files = (await readdir(dir)).filter((name) => name.endsWith(".json3"));
    if (!files.length) return { duration: Number.isFinite(duration) ? duration : null, segments: null };
    const raw = await readFile(path.join(dir, files[0]), "utf8");
    return {
      duration: Number.isFinite(duration) ? duration : null,
      segments: segmentsFromJson3(raw),
    };
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

let segments = null;
let duration = null;
let source = null;

try {
  segments = await fromTimedText();
  if (segments) source = "youtube-timedtext";
} catch {
  segments = null;
}

if (!segments) {
  try {
    const downloaded = await fromYtDlp();
    segments = downloaded.segments;
    duration = downloaded.duration;
    if (segments?.length) source = "yt-dlp";
  } catch (error) {
    console.error(String(error.stderr || error.message || error).split("\n")[0]);
  }
}

if (!segments?.length) {
  console.error(
    `No timed captions for ${videoId}. Leave cues off this song. Do not invent timings.`,
  );
  process.exit(2);
}

const last = segments[segments.length - 1].start;
console.log(
  JSON.stringify(
    {
      videoId,
      source,
      duration: duration ?? null,
      lastCaptionStart: last,
      segments,
    },
    null,
    2,
  ),
);
