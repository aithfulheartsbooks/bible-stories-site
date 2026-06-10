import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const publicDir = path.join(root, "public");
const puzzleDir = path.join(publicDir, "play", "puzzles");
const stickerDir = path.join(publicDir, "play", "stickers");
const reviewPath = path.join(publicDir, "play-asset-review.html");
const manifestPath = path.join(root, "data", "puzzles.json");

const books = [
  {
    number: 1,
    slug: "noah-and-gods-big-promise",
    title: "Noah and God's Big Promise",
    amazonUrl: "https://www.amazon.com/dp/B0GYHZ8P9S",
    candidates: [{ id: "noah-01", source: "covers/noah.png", caption: "Noah remembers God's big promise." }],
    stickers: [
      { id: "noah-rainbow", name: "Rainbow Promise", source: "covers/noah.png", x: 0.5, y: 0.38, r: 0.3 },
    ],
  },
];

const chosenIds = new Set(
  process.argv
    .find((arg) => arg.startsWith("--chosen="))
    ?.replace("--chosen=", "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean) || []
);
const force = process.argv.includes("--force");

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureDirs() {
  await fs.mkdir(puzzleDir, { recursive: true });
  await fs.mkdir(stickerDir, { recursive: true });
}

async function writeIfMissing(filePath, buffer) {
  if (!force && (await exists(filePath))) return;
  await fs.writeFile(filePath, buffer);
}

async function makePuzzleImage(candidate, book) {
  const source = path.join(publicDir, candidate.source);
  const outPath = path.join(puzzleDir, `${candidate.id}.jpg`);
  const image = sharp(source);
  const meta = await image.metadata();
  const size = Math.min(meta.width || 1200, meta.height || 1200);
  const left = Math.max(0, Math.floor(((meta.width || size) - size) / 2));
  const top = Math.max(0, Math.floor(((meta.height || size) - size) / 2));

  const buffer = await image
    .extract({ left, top, width: size, height: size })
    .resize(1200, 1200)
    .jpeg({ quality: 80 })
    .toBuffer();

  await writeIfMissing(outPath, buffer);

  return {
    id: candidate.id,
    bookNumber: book.number,
    bookTitle: book.title,
    image: `/play/puzzles/${candidate.id}.jpg`,
    amazonUrl: book.amazonUrl,
    stickerId: book.stickers[0]?.id || `${candidate.id}-sticker`,
    caption: candidate.caption,
  };
}

async function makeSticker(sticker) {
  const source = path.join(publicDir, sticker.source);
  const outPath = path.join(stickerDir, `${sticker.id}.png`);
  const meta = await sharp(source).metadata();
  const width = meta.width || 512;
  const height = meta.height || 512;
  const radius = Math.round(Math.min(width, height) * sticker.r);
  const centerX = Math.round(width * sticker.x);
  const centerY = Math.round(height * sticker.y);
  const left = Math.max(0, Math.min(width - radius * 2, centerX - radius));
  const top = Math.max(0, Math.min(height - radius * 2, centerY - radius));

  const crop = await sharp(source)
    .extract({ left, top, width: radius * 2, height: radius * 2 })
    .resize(512, 512)
    .png()
    .toBuffer();

  const mask = Buffer.from(
    `<svg width="512" height="512" viewBox="0 0 512 512">
      <circle cx="256" cy="256" r="244" fill="white"/>
    </svg>`
  );

  const ringColor = sticker.golden ? "#e8a854" : "#fdf6e9";
  const ring = Buffer.from(
    `<svg width="512" height="512" viewBox="0 0 512 512">
      <circle cx="256" cy="256" r="248" fill="none" stroke="${ringColor}" stroke-width="20"/>
    </svg>`
  );

  const buffer = await sharp(crop)
    .composite([{ input: mask, blend: "dest-in" }, { input: ring, blend: "over" }])
    .png()
    .toBuffer();

  await writeIfMissing(outPath, buffer);

  return {
    id: sticker.id,
    name: sticker.name,
    image: `/play/stickers/${sticker.id}.png`,
    bookNumber: sticker.bookNumber,
    rarity: sticker.golden ? "golden" : "common",
  };
}

async function writeReviewSheet() {
  const rows = books
    .map((book) => {
      const cards = book.candidates
        .map((candidate) => {
          const imageUrl = `/${candidate.source.replaceAll("\\", "/")}`;
          return `<label class="card">
            <input type="checkbox" value="${candidate.id}">
            <img src="${imageUrl}" alt="${candidate.id}">
            <strong>${candidate.id}</strong>
            <span>${candidate.caption}</span>
          </label>`;
        })
        .join("");

      return `<section><h2>Book ${book.number}: ${book.title}</h2><div class="grid">${cards}</div></section>`;
    })
    .join("");

  await fs.writeFile(
    reviewPath,
    `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Play Asset Review</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 32px; background: #fdf6e9; color: #5a3d2b; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 18px; }
    .card { display: grid; gap: 8px; padding: 12px; border: 1px solid rgba(90,61,43,.2); border-radius: 18px; background: white; }
    img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 14px; }
    input { width: 20px; height: 20px; }
  </style>
</head>
<body>
  <h1>Play Asset Review</h1>
  <p>Check 2-3 scenes per book, then rerun: <code>node scripts/build-play-assets.mjs --chosen=id-1,id-2</code>.</p>
  ${rows}
</body>
</html>`
  );
}

async function main() {
  await ensureDirs();
  await writeReviewSheet();

  if (chosenIds.size === 0) {
    console.log(`Wrote contact sheet: ${pathToFileURL(reviewPath).href}`);
    console.log("No final assets exported because --chosen was not provided.");
    return;
  }

  const puzzles = [];
  const stickers = [];

  for (const book of books) {
    for (const candidate of book.candidates) {
      if (chosenIds.has(candidate.id)) {
        puzzles.push(await makePuzzleImage(candidate, book));
      }
    }

    for (const sticker of book.stickers) {
      stickers.push(await makeSticker({ ...sticker, bookNumber: book.number }));
    }
  }

  const manifest = {
    launchDate: "2026-06-15",
    puzzles,
    dateOverrides: {},
    stickers,
  };

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Wrote ${puzzles.length} puzzle(s), ${stickers.length} sticker(s), and ${manifestPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
