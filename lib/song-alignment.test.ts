import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { checkSungLines, SUNG_LINE_FIX, type SongAlignment } from "@/lib/song-alignment";
import { songs } from "@/lib/songs";

const root = process.cwd();

function readJson(relative: string) {
  return JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
}

function printedLines(slug: string) {
  const song = songs.find((item) => item.slug === slug);
  assert.ok(song);
  assert.equal(song.lyricsStatus, "lyrics-ok");
  if (song.lyricsStatus !== "lyrics-ok") return [];
  return song.lyrics.filter((part) => part.kind === "line").map((part) => part.text);
}

test("every printed line is sung on the song's own video", () => {
  const manifest = readJson("data/song-alignment.json") as Record<string, SongAlignment>;
  for (const song of songs) {
    assert.equal(song.lyricsStatus, "lyrics-ok");
    if (song.lyricsStatus !== "lyrics-ok") continue;
    const lines = song.lyrics.filter((part) => part.kind === "line").map((part) => part.text);
    checkSungLines(song.slug, song.videoId, lines, manifest[song.slug]);
  }
});

test("a manifest for a different video id fails", () => {
  const alignment: SongAlignment = {
    videoId: "other-video",
    duration: 30,
    cues: [{ line: 0, start: 1, score: 1 }],
  };
  assert.throws(
    () => checkSungLines("example", "f1JbSvhw43I", ["Jesus loves me, this I know,"], alignment),
    /alignment manifest video id other-video does not match f1JbSvhw43I/,
  );
});

test("the old Jesus Loves Me video does not sing the He who died stanza", () => {
  const alignment = readJson("data/jesus-loves-me-f1JbSvhw43I.alignment.json") as SongAlignment;
  assert.equal(alignment.videoId, "f1JbSvhw43I");
  const lines = printedLines("jesus-loves-me");
  assert.ok(lines.some((line) => line.startsWith("Jesus loves me, He who died")));
  assert.throws(
    () => checkSungLines("jesus-loves-me", "f1JbSvhw43I", lines, alignment),
    (error: unknown) => {
      assert.ok(error instanceof Error);
      assert.match(error.message, new RegExp(SUNG_LINE_FIX.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
      assert.match(error.message, /Jesus loves me, He who died/);
      assert.match(error.message, /Heaven's gate to open wide/);
      assert.match(error.message, /He will wash away my sin/);
      assert.match(error.message, /Let His little child come in/);
      return true;
    },
  );
});
