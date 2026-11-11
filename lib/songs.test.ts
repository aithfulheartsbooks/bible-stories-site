import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { books } from "@/app/books";
import { TONIGHT_SONG_BY_BOOK } from "@/lib/tonight-song";
import { activeLyricLine } from "@/lib/lyric-sync";
import {
  SONG_GROUPS,
  answerFromSongs,
  findSong,
  formatSongKnowledge,
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
    const link = song.bookLink;
    assert.ok(link, song.title);
    if (!link) continue;
    if (link.kind === "book") {
      assert.equal(bookSlugs.has(link.slug), true, link.slug);
      assert.equal(link.href, `/book/${link.slug}`);
      const linked = books.find((book) => book.slug === link.slug);
      assert.ok(linked);
      assert.match(link.anchor, new RegExp(linked.title.replace(/^The /, "").split(" ")[0], "i"));
    } else {
      assert.equal(link.href, "/");
      assert.match(link.anchor, /Bible stories/);
    }
  }
});

test("tonight's song matches only real story nights", () => {
  const bookSlugs = new Set(books.map((book) => book.slug));
  const songSlugs = new Set(songs.map((song) => song.slug));
  for (const [bookSlug, pick] of Object.entries(TONIGHT_SONG_BY_BOOK)) {
    assert.equal(bookSlugs.has(bookSlug), true, bookSlug);
    assert.equal(songSlugs.has(pick.slug), true, pick.slug);
    assert.equal(songForTonight(bookSlug).slug, pick.slug);
    assert.equal(songForTonight(bookSlug).title, findSong(pick.slug).title);
  }
  assert.equal(songForTonight("noah-and-gods-big-promise").slug, "this-little-light-of-mine");
  assert.equal(songForTonight("david-and-the-giant").title, findSong("little-david-play-on-your-harp").title);
  for (const slug of ["the-wedding-at-cana", "noah-and-gods-big-promise", "", null, undefined]) {
    assert.equal(songForTonight(slug).slug, "this-little-light-of-mine");
  }
  assert.notEqual(songForTonight("noah-and-gods-big-promise").slug, "who-built-the-ark");
  assert.notEqual(songForTonight("david-and-the-giant").slug, "zacchaeus-was-a-wee-little-man");
});

test("lyric cues stay strictly increasing, inside the video, and cover every printed line", () => {
  for (const song of songs) {
    assert.equal(song.lyricsStatus, "lyrics-ok");
    if (song.lyricsStatus !== "lyrics-ok") continue;
    assert.ok(song.cues && song.cues.length > 0, song.slug);
    assert.equal(typeof song.videoDuration, "number");
    assert.ok(song.videoDuration && song.videoDuration > 0);
    const lineCount = song.lyrics.filter((part) => part.kind === "line").length;
    const covered = new Set<number>();
    let previous = -1;
    for (const cue of song.cues) {
      assert.ok(cue.line >= 0 && cue.line < lineCount, `${song.slug} line ${cue.line}`);
      assert.ok(cue.start > previous, `${song.slug} ${cue.start} after ${previous}`);
      assert.ok(cue.start >= 0 && cue.start < (song.videoDuration ?? 0), song.slug);
      covered.add(cue.line);
      previous = cue.start;
    }
    for (let line = 0; line < lineCount; line += 1) {
      assert.equal(covered.has(line), true, `${song.slug} printed line ${line} has no cue`);
    }
  }
});

test("active line follows repeats and clears in the gaps", () => {
  const cues = [
    { line: 0, start: 10 },
    { line: 1, start: 14 },
    { line: 2, start: 18 },
    { line: 0, start: 40 },
    { line: 1, start: 44 },
  ];
  assert.equal(activeLyricLine(cues, 9), null);
  assert.equal(activeLyricLine(cues, 10), 0);
  assert.equal(activeLyricLine(cues, 13.9), 0);
  assert.equal(activeLyricLine(cues, 14), 1);
  assert.equal(activeLyricLine(cues, 18), 2);
  assert.equal(activeLyricLine(cues, 30), null);
  assert.equal(activeLyricLine(cues, 40), 0);
  assert.equal(activeLyricLine(cues, 44), 1);
  assert.equal(activeLyricLine(cues, 80), null);

  const sunbeam = findSong("jesus-wants-me-for-a-sunbeam");
  assert.equal(sunbeam.lyricsStatus, "lyrics-ok");
  if (sunbeam.lyricsStatus !== "lyrics-ok" || !sunbeam.cues) return;
  const printed = sunbeam.lyrics.filter((part) => part.kind === "line").length;
  assert.equal(printed, 8);
  const highlighted = new Set<number>();
  const duration = sunbeam.videoDuration ?? 0;
  for (let time = 0; time < duration; time += 0.25) {
    const line = activeLyricLine(sunbeam.cues, time);
    if (line != null) highlighted.add(line);
  }
  // The recording sings the third verse, so those lines are cued.
  assert.equal(highlighted.has(printed - 1), true);
  assert.equal(highlighted.has(printed - 2), true);
  const last = sunbeam.cues[sunbeam.cues.length - 1];
  assert.equal(activeLyricLine(sunbeam.cues, last.start), last.line);
  assert.equal(activeLyricLine(sunbeam.cues, last.start + 30), null);
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
    assert.equal(song.lyricsStatus, "lyrics-ok");
  }
});

const FINAL_SLUGS = [
  "this-little-light-of-mine",
  "ive-got-the-joy",
  "hallelujah-praise-ye-the-lord",
  "jesus-wants-me-for-a-sunbeam",
  "do-lord",
  "ive-got-peace-like-a-river",
  "wide-wide-as-the-ocean",
  "jesus-loves-me",
  "hes-got-the-whole-world",
  "praise-him-praise-him",
  "jesus-loves-even-me",
  "away-in-a-manger",
  "zacchaeus-was-a-wee-little-man",
  "the-b-i-b-l-e",
  "joshua-fought-the-battle-of-jericho",
  "little-david-play-on-your-harp",
  "who-did-swallow-jonah",
  "dare-to-be-a-daniel",
];

const REMOVED = [
  "father-abraham",
  "deep-and-wide",
  "be-careful-little-eyes",
  "if-youre-happy-and-you-know-it",
  "give-me-oil-in-my-lamp",
  "rise-and-shine",
  "who-built-the-ark",
  "the-wise-man-built-his-house",
  "jesus-loves-the-little-children",
  "Father Abraham",
  "Deep and Wide",
  "Be Careful, Little Eyes",
  "If You're Happy",
  "Give Me Oil",
  "Rise and Shine",
  "Who Built the Ark",
  "Wise Man",
  "Little Children",
];

test("Ask Angel song knowledge matches the 18-song list", () => {
  const knowledge = formatSongKnowledge();
  assert.equal(songTotal(), FINAL_SLUGS.length);
  for (const slug of FINAL_SLUGS) {
    assert.equal(songs.some((song) => song.slug === slug), true, slug);
    assert.match(knowledge, new RegExp(slug));
  }
  const widget = fs.readFileSync(path.join(process.cwd(), "components/AskAngelWidget.tsx"), "utf8");
  assert.match(widget, /formatSongKnowledge/);
  for (const removed of REMOVED) {
    assert.equal(songs.some((song) => song.slug === removed || song.title === removed), false, removed);
    assert.equal(knowledge.includes(removed), false, removed);
  }
  const jonah = answerFromSongs("What song goes with the Jonah story?");
  const gentle = answerFromSongs("Can you suggest a gentle bedtime song?");
  const about = answerFromSongs("Where did About go?");
  assert.match(jonah ?? "", /who-did-swallow-jonah/);
  assert.match(jonah ?? "", /\/songs\?song=/);
  assert.match(gentle ?? "", /\/songs\?song=/);
  assert.match(about ?? "", /footer/);
  assert.match(about ?? "", /\/about/);
  assert.doesNotMatch(knowledge, /\.\./);
  console.log("\nASK ANGEL\n" + [jonah, gentle, about].join("\n"));
});

test("Ask Angel links /songs and lets a bedtime song question win", () => {
  const widget = fs.readFileSync(path.join(process.cwd(), "components/AskAngelWidget.tsx"), "utf8");
  const paths = widget.match(/\/\(\?:(play\|tonight\|[^)]+)\)\(\?:\[\^\\s<\]\*\)\?\)/);
  assert.ok(paths);
  const re = new RegExp(`(^|[\\s>])(/(?:${paths[1]})(?:[^\\s<]*)?)`, "gi");
  const deepLink = "Try /songs?song=who-did-swallow-jonah tonight".replace(re, (_match, prefix, path) => {
    return `${prefix}<a href="https://www.faithfulheartsbooks.com${path}">${path}</a>`;
  });
  const pageLink = "Open /songs for the list".replace(re, (_match, prefix, path) => {
    return `${prefix}<a href="https://www.faithfulheartsbooks.com${path}">${path}</a>`;
  });
  assert.match(deepLink, /href="https:\/\/www\.faithfulheartsbooks\.com\/songs\?song=who-did-swallow-jonah"/);
  assert.match(pageLink, /href="https:\/\/www\.faithfulheartsbooks\.com\/songs"/);

  const fallback = widget.slice(widget.indexOf("function localFallbackReply"), widget.indexOf("function avatarSVG"));
  const songAt = fallback.indexOf("if (/song|sing along|sing-along|hymn/");
  const tonightAt = fallback.indexOf("if (/tonight|bedtime|bed time|what to read|nightly story/");
  assert.ok(songAt >= 0 && tonightAt > songAt);
});
