import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

/**
 * Glyphs that iOS Safari paints as emoji (or as thin text) when used as
 * player icons. U+FE0F is the emoji variation selector that turns ▶ into ▶️.
 */
const MEDIA_GLYPHS: readonly { cp: number; name: string }[] = [
  { cp: 0x25b6, name: "U+25B6 play triangle" },
  { cp: 0x25b7, name: "U+25B7 white play triangle" },
  { cp: 0x25ba, name: "U+25BA black right pointer" },
  { cp: 0x25c0, name: "U+25C0 reverse triangle" },
  { cp: 0x25c1, name: "U+25C1 white left triangle" },
  { cp: 0x25c4, name: "U+25C4 black left pointer" },
  { cp: 0x23ee, name: "U+23EE previous track" },
  { cp: 0x23ed, name: "U+23ED next track" },
  { cp: 0x23ef, name: "U+23EF play/pause" },
  { cp: 0x23f4, name: "U+23F4 reverse button" },
  { cp: 0x23f5, name: "U+23F5 play button" },
  { cp: 0x23f8, name: "U+23F8 pause" },
  { cp: 0x23f9, name: "U+23F9 stop" },
  { cp: 0x23e9, name: "U+23E9 fast-forward" },
  { cp: 0x23ea, name: "U+23EA rewind" },
  { cp: 0xfe0f, name: "U+FE0F emoji variation selector" },
  { cp: 0x2039, name: "U+2039 single left chevron" },
  { cp: 0x203a, name: "U+203A single right chevron" },
];

const PLAYER_SOURCE = path.join(process.cwd(), "app/songs/SongsClient.tsx");

/** The transport row and poster play mark as they were before the SVG icons. */
const OLD_PLAYER_CONTROLS = [
  '<button type="button" aria-label="Previous song">‹</button>',
  '<button type="button" aria-label="Play">▶</button>',
  '<button type="button" aria-label="Next song">›</button>',
  '<span class="grid h-16 w-16 place-items-center rounded-full bg-terracotta text-2xl text-cream shadow-lg">▶</span>',
].join("\n");

function findMediaGlyphs(source: string): string[] {
  const hits: string[] = [];
  for (const glyph of MEDIA_GLYPHS) {
    const hex = glyph.cp.toString(16);
    const padded = hex.padStart(4, "0");
    const present =
      source.includes(String.fromCodePoint(glyph.cp)) ||
      new RegExp(`\\\\u\\{0*${hex}\\}`, "i").test(source) ||
      new RegExp(`\\\\u${padded}`, "i").test(source) ||
      new RegExp(`&#x0*${hex};`, "i").test(source) ||
      new RegExp(`&#${glyph.cp};`).test(source);
    if (present) hits.push(glyph.name);
  }
  return hits;
}

function assertSvgIcons(source: string, label: string) {
  const hits = findMediaGlyphs(source);
  if (hits.length === 0) return;
  throw new Error(
    `${label} contains unicode media glyphs (${hits.join(", ")}). Use the PlayerIcon SVG component instead of emoji or unicode media symbols.`,
  );
}

test("the old song player controls fail the SVG icon guard", () => {
  assert.throws(
    () => assertSvgIcons(OLD_PLAYER_CONTROLS, "old song player"),
    /Use the PlayerIcon SVG component/,
  );
  const hits = findMediaGlyphs(OLD_PLAYER_CONTROLS);
  assert.ok(hits.some((hit) => hit.includes("U+25B6")));
  assert.ok(hits.some((hit) => hit.includes("U+2039")));
  assert.ok(hits.some((hit) => hit.includes("U+203A")));

  assert.throws(() => assertSvgIcons("⏸", "pause glyph"), /PlayerIcon SVG component/);
  assert.throws(() => assertSvgIcons("\uFE0F", "variation selector"), /PlayerIcon SVG component/);
  assert.throws(() => assertSvgIcons("\\u23ED", "escaped next-track glyph"), /PlayerIcon SVG component/);
  assert.throws(() => assertSvgIcons("&#x25C0;", "entity reverse triangle"), /PlayerIcon SVG component/);
});

test("the song player source uses SVG icons instead of unicode media glyphs", () => {
  const source = fs.readFileSync(PLAYER_SOURCE, "utf8");
  assertSvgIcons(source, "app/songs/SongsClient.tsx");
  assert.match(source, /function PlayerIcon/);
  assert.match(source, /aria-label="Previous song"/);
  assert.match(source, /aria-label="Next song"/);
  assert.match(source, /aria-label=\{playing \? "Pause" : "Play"\}/);
});
