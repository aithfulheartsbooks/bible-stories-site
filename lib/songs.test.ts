import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { books } from "@/app/books";
import {
  SONG_GROUPS,
  findSong,
  groupCount,
  songTotal,
  songs,
  songForTonight,
  songsInGroup,
  type LyricsOkSong,
  type Song,
} from "@/lib/songs";

const songSource = fs.readFileSync(path.join(process.cwd(), "lib/songs.ts"), "utf8");

function linesOf(song: Song) {
  if (song.lyricsStatus !== "lyrics-ok") return [];
  return song.lyrics.filter((part) => part.kind === "line").map((part) => part.text);
}

test("group counts and the total come from the song data", () => {
  assert.deepEqual(
    SONG_GROUPS.map((group) => group.title),
    ["Action Songs", "Gentle Songs", "Bible Story Songs"],
  );
  assert.ok(songTotal() > 0);
  let summed = 0;
  for (const group of SONG_GROUPS) {
    const count = groupCount(group.id);
    summed += count;
    assert.equal(count, songs.filter((song) => song.group === group.id).length);
    assert.equal(count, songsInGroup(group.id).length);
  }
  assert.equal(summed, songTotal());
  assert.equal(summed, songs.length);
});

test("a video-only song cannot carry lyrics", () => {
  const videoOnly = songs.filter((song) => song.lyricsStatus === "video-only");
  assert.ok(videoOnly.length > 0);
  for (const song of videoOnly) {
    assert.equal(Object.hasOwn(song, "lyrics"), false);
    const probe = song as Song & { lyrics?: unknown };
    assert.equal(probe.lyrics, undefined);
  }
  for (const song of songs) {
    if (song.lyricsStatus === "lyrics-ok") {
      const withLyrics: LyricsOkSong = song;
      assert.ok(withLyrics.lyrics.some((part) => part.kind === "line"));
    }
  }
});

test("Zacchaeus prints only the traditional first verse", () => {
  const song = songs.find((item) => item.slug === "zacchaeus-was-a-wee-little-man");
  assert.ok(song);
  assert.equal(song.lyricsStatus, "lyrics-ok");
  if (song.lyricsStatus !== "lyrics-ok") return;
  assert.deepEqual(linesOf(song), [
    "Zacchaeus was a wee little man,",
    "And a wee little man was he.",
    "He climbed up in a sycamore tree",
    "For the Lord he wanted to see.",
    "And as the Savior passed that way",
    "He looked up in the tree,",
    "And he said, “Zacchaeus, you come down,",
    "For I'm going to your house today.”",
  ]);
  const text = linesOf(song).join(" ");
  assert.doesNotMatch(text, /happy man|half of my goods|gave it back/i);
  assert.equal(song.lyrics.filter((part) => part.kind === "label").length, 0);
});

test("The B-I-B-L-E prints only the short original verse", () => {
  const song = songs.find((item) => item.slug === "the-b-i-b-l-e");
  assert.ok(song);
  assert.equal(song.lyricsStatus, "lyrics-ok");
  if (song.lyricsStatus !== "lyrics-ok") return;
  assert.deepEqual(linesOf(song), [
    "The B-I-B-L-E,",
    "Yes, that's the Book for me.",
    "I stand alone on the Word of God,",
    "The B-I-B-L-E.",
  ]);
  const text = linesOf(song).join(" ");
  assert.match(text, /The B-I-B-L-E/);
  assert.match(text, /I stand alone on the Word of God/);
  assert.doesNotMatch(text, /I have a book|God's holy Word I'll|I'll read and pray|every day/i);
});

test("the color line and unverified texts stay out of the printed words", () => {
  assert.doesNotMatch(songSource, /Red and yellow, black and white/i);
  assert.doesNotMatch(JSON.stringify(songs), /Red and yellow, black and white/i);
  for (const slug of ["the-wise-man-built-his-house", "jesus-loves-the-little-children"]) {
    const song = songs.find((item) => item.slug === slug);
    assert.ok(song);
    assert.equal(song.lyricsStatus, "video-only");
    assert.equal(Object.hasOwn(song, "lyrics"), false);
  }
  for (const slug of ["this-little-light-of-mine", "zacchaeus-was-a-wee-little-man", "the-b-i-b-l-e"]) {
    const song = songs.find((item) => item.slug === slug);
    assert.ok(song);
    assert.equal(song.lyricsStatus, "lyrics-ok");
  }
});

test("excluded songs appear nowhere in the song data", () => {
  assert.doesNotMatch(songSource, /My God Is So Great/i);
  assert.doesNotMatch(songSource, /My God Is So Big/i);
  assert.doesNotMatch(songSource, /I Am a C-H-R-I-S-T-I-A-N/i);
  assert.doesNotMatch(songSource, /C-H-R-I-S-T-I-A-N/);
  const blob = JSON.stringify(songs);
  assert.doesNotMatch(blob, /My God Is So Great/i);
  assert.doesNotMatch(blob, /C-H-R-I-S-T-I-A-N/);
});

test("every story-song book link resolves", () => {
  const bookSlugs = new Set(books.map((book) => book.slug));
  const story = songsInGroup("story");
  assert.equal(story.length, groupCount("story"));
  for (const song of story) {
    assert.ok(song.bookLink, song.title);
    if (!song.bookLink) continue;
    if (song.bookLink.kind === "book") {
      assert.equal(bookSlugs.has(song.bookLink.slug), true, song.bookLink.slug);
      assert.equal(song.bookLink.href, `/book/${song.bookLink.slug}`);
      assert.match(song.bookLink.anchor, new RegExp(song.bookLink.slug === "zacchaeus" ? "Zacchaeus" : "Noah and God's Big Promise"));
    } else {
      assert.equal(song.bookLink.href, "/");
      assert.match(song.bookLink.anchor, /Bible stories/);
    }
  }
});

test("tonight's song matches only real story nights", () => {
  assert.equal(songForTonight("zacchaeus").slug, "zacchaeus-was-a-wee-little-man");
  assert.equal(songForTonight("noah-and-gods-big-promise").slug, "rise-and-shine");
  assert.equal(songForTonight("zacchaeus").title, findSong("zacchaeus-was-a-wee-little-man").title);
  assert.equal(songForTonight("noah-and-gods-big-promise").title, findSong("rise-and-shine").title);
  assert.equal(songForTonight("david-and-the-giant").title, findSong("this-little-light-of-mine").title);
  for (const slug of [
    "david-and-the-giant",
    "the-christmas-story",
    "jonah-and-the-big-fish",
    "who-built-the-ark",
    "",
    null,
    undefined,
  ]) {
    assert.equal(songForTonight(slug).slug, "this-little-light-of-mine");
  }
  assert.notEqual(songForTonight("noah-and-gods-big-promise").slug, "who-built-the-ark");
  assert.notEqual(songForTonight("david-and-the-giant").slug, "zacchaeus-was-a-wee-little-man");
});

test("lyric cues stay strictly increasing and inside the video", () => {
  for (const song of songs) {
    if (song.lyricsStatus !== "lyrics-ok" || !song.cues) continue;
    assert.equal(typeof song.videoDuration, "number");
    assert.ok(song.videoDuration && song.videoDuration > 0);
    const lineCount = song.lyrics.filter((part) => part.kind === "line").length;
    let previous = -1;
    for (const cue of song.cues) {
      assert.ok(cue.line >= 0 && cue.line < lineCount);
      assert.ok(cue.start > previous);
      assert.ok(cue.start < (song.videoDuration ?? 0));
      previous = cue.start;
    }
  }
});

test("every song has a video id and the catalog slugs are unique", () => {
  const slugs = new Set(songs.map((song) => song.slug));
  const videos = new Set(songs.map((song) => song.videoId));
  assert.equal(slugs.size, songTotal());
  assert.equal(videos.size, songTotal());
  for (const song of songs) {
    assert.match(song.videoId, /^[\w-]{6,}$/);
    assert.ok(song.channel);
    assert.ok(song.embedCheck.includes("200"));
  }
});
