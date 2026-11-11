import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  playLoadedSingAlong,
  singAlongEmbedSrc,
  startSingAlongFromTap,
  type SingAlongFrame,
} from "@/lib/sing-along-player";

function frame(): SingAlongFrame {
  return {
    id: "",
    src: "",
    title: "",
    allow: "",
    className: "",
    referrerPolicy: "",
    allowFullscreen: false,
  };
}

function host() {
  let child: SingAlongFrame | null = null;
  return {
    get child() {
      return child;
    },
    replaceChildren(node: SingAlongFrame) {
      child = node;
    },
    ownerDocument: {
      createElement() {
        return frame();
      },
    },
  };
}

test("facade tap creates player with autoplay", () => {
  const player = host();
  const created = startSingAlongFromTap(
    player,
    "Xe_1XJsjMZY",
    "This Little Light of Mine",
    "https://www.faithfulheartsbooks.com",
  );

  assert.equal(created, player.child);
  assert.equal(created.id, "sing-along-player");
  assert.match(created.src, /^https:\/\/www\.youtube-nocookie\.com\/embed\/Xe_1XJsjMZY\?/);
  assert.match(created.src, /[?&]autoplay=1(?:&|$)/);
  assert.match(created.src, /[?&]playsinline=1(?:&|$)/);
  assert.match(created.src, /enablejsapi=1/);
  assert.match(created.allow, /autoplay/);
  assert.equal(created.referrerPolicy, "strict-origin-when-cross-origin");
  assert.equal(created.allowFullscreen, true);
  assert.equal(created.title, "This Little Light of Mine sing-along video");

  const switched = startSingAlongFromTap(
    player,
    "BfJY082DcP8",
    "Joshua Fought the Battle of Jericho",
    "https://www.faithfulheartsbooks.com",
  );
  assert.equal(switched, player.child);
  assert.match(switched.src, /\/embed\/BfJY082DcP8\?/);
  assert.match(switched.src, /autoplay=1/);
  assert.match(switched.src, /playsinline=1/);
  assert.doesNotMatch(switched.src, /Xe_1XJsjMZY/);
});

test("embed url stays on the nocookie host", () => {
  const src = singAlongEmbedSrc("h4Jcl_ax2OE", "http://localhost:3456");
  assert.match(src, /^https:\/\/www\.youtube-nocookie\.com\/embed\/h4Jcl_ax2OE\?/);
  assert.match(src, /origin=http%3A%2F%2Flocalhost%3A3456/);
  assert.doesNotMatch(src, /https:\/\/www\.youtube\.com\//);
});

test("the song page starts playback inside the tap handler", () => {
  const source = fs.readFileSync(path.join(process.cwd(), "app/songs/SongsClient.tsx"), "utf8");
  const choose = source.slice(source.indexOf("function choose"), source.indexOf("function step"));
  const code = choose.replace(/\/\/.*$/gm, "");
  assert.match(code, /playLoadedSingAlong/);
  assert.doesNotMatch(code, /\bawait\b/);
  assert.doesNotMatch(choose, /useEffect/);
  assert.doesNotMatch(source, /onClick=\{async[^}]*choose\(/);
  const playAt = code.indexOf("playLoadedSingAlong");
  assert.ok(playAt > 0);
  assert.doesNotMatch(code.slice(0, playAt), /\bawait\b/);
});

test("playLoadedSingAlong calls the player synchronously", () => {
  const calls: string[] = [];
  const player = {
    loadVideoById(id: string) {
      calls.push(`load:${id}`);
    },
    playVideo() {
      calls.push("play");
    },
  };
  assert.equal(playLoadedSingAlong(player, "Xe_1XJsjMZY", null), "Xe_1XJsjMZY");
  assert.deepEqual(calls, ["load:Xe_1XJsjMZY", "play"]);
  assert.equal(playLoadedSingAlong(player, "Xe_1XJsjMZY", "Xe_1XJsjMZY"), "Xe_1XJsjMZY");
  assert.deepEqual(calls, ["load:Xe_1XJsjMZY", "play", "play"]);
});

test("a not-ready fallback iframe does not autoplay", () => {
  const player = host();
  const created = startSingAlongFromTap(
    player,
    "Xe_1XJsjMZY",
    "This Little Light of Mine",
    "https://www.faithfulheartsbooks.com",
    false,
  );
  assert.match(created.src, /[?&]autoplay=0(?:&|$)/);
  assert.match(created.src, /playsinline=1/);
});
