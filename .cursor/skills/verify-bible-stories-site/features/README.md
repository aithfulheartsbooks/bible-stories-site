# Bible Stories for Little Hearts verification map

This directory is the maintained source for verifying the public marketing site. Read this index before driving, then use the matching feature file as the recipe.

## Baseline preconditions

- Dependencies installed (`npm install`) and Chromium available (`npx playwright install chromium`).
- A verification instance launched with `node .cursor/skills/verify-bible-stories-site/scripts/verify.mjs launch` (default `http://127.0.0.1:4173`).
- `node .cursor/skills/verify-bible-stories-site/scripts/verify.mjs doctor` is green for **that** URL and pid.
- Never drive `localhost:3000`, Vercel, or `https://www.faithfulheartsbooks.com` as a substitute for the launched instance.
- Use a fresh Playwright context. Play stickers (`localStorage` `fhb_play_v1`) and the Ask Angel in-page history are per browser profile.

## Driving conventions

- Start from `/` unless the feature file says a deep link is an official entry point.
- Prefer role + accessible name, then id (`#books`, `#peek`, `#ask-angel-btn`), then visible exact text from the checkout. No click coordinates.
- Treat quoted UI strings as literal. Do not invent replacement copy.
- One `drive` invocation proves one feature ID. Record the entry point used.
- Restore nothing on the server (there is no server state). For Play, do not leave a confirmation dialog open; do not click `Start over` unless the recipe says to.
- Keep proof artifacts under `evidence/`. Cleanup must not remove them.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- UI proof includes an ARIA snapshot and a screenshot with the brand or page heading visible.
- External posts (Formspree, Mailchimp, Amazon, YouTube, Ask Angel worker) are production boundaries. Prove the local control and destination, not a successful third-party write.
- Record the feature ID and entry point on every artifact (`notes.md`).
- Report an unrun entry point as not run. Do not claim the nav path is proven because the deep link worked.

## Feature entry contract

Each feature file starts with an H1 and one paragraph, then exactly four H2 sections: `Sub-features`, `How to get to it (user POV)`, `Driving it with verify.mjs`, `Gotchas`.

## Features

- [Homepage collection](./homepage-collection.md) — theme filters, sort, pagination, Series Map, opening a book card.
- [Book pages](./book-pages.md) — title, peek reader, Amazon CTA, optional Sing Along embed.
- [Tonight](./tonight.md) — nightly pick, peek pages, mood picker, copy caption.
- [Play](./play.md) — daily three puzzles, peek, difficulty, sticker album storage.
- [Ask Angel](./ask-angel.md) — widget open/send, books API, worker-or-fallback reply.

## Not mapped yet

Drive these only after adding a feature file (see `/maintain-verification-skill`):

- `/churches` — this week's Sunday school kit (`app/churches/`).
- `/contact` — Formspree form. Do not submit.
- `/free-resources` — printables + search. High value; add next.
- `/about`, `/newsletter/thank-you`, `/contact/thank-you`.
- `/secret-giveaway-lab`, `/secret-book-wheel` — not public marketing surfaces.
