---
name: verify-bible-stories-site
description: Verify the Bible Stories for Little Hearts public marketing site (faithfulheartsbooks.com / this Next.js checkout) in a real browser. Use when proving homepage collection, book pages, Tonight, Play, Free Resources, or Ask Angel after UI or content changes.
---

# Verify Bible Stories for Little Hearts

This skill is for the next agent. The product is a public Next.js 14 marketing site. A visitor browses books, opens a book page, picks tonight's bedtime story, plays the daily puzzle, downloads printables, or asks Angel for a recommendation. There is no login and no local database.

Read [features/README.md](features/README.md) before driving. Drive the mapped user path, not a shortcut.

## Interview (this checkout)

- **Surface (primary):** public web UI. Routes that matter: `/`, `/book/[slug]`, `/tonight`, `/play`, `/churches`, `/free-resources`, `/contact`, `/about`. Ask Angel is a fixed widget on every page (`#ask-angel-btn`). Live site: `https://www.faithfulheartsbooks.com`.
- **Surface (secondary, do not treat as the product):** `GET /api/ask-angel-books` (JSON book list for the widget), Formspree contact POST, Mailchimp newsletter POST, Ask Angel Cloudflare worker, Amazon product links, YouTube embeds.
- **Run:** `npm install` once, then the repo's own `npm run dev` (Next.js, default `http://localhost:3000`). No env file, no seed data, no auth. Node 18+.
- **Drive:** this repo had no Playwright/Cypress. Verification scaffolding is the helper in [scripts/verify.mjs](scripts/verify.mjs) plus Playwright Chromium. Prefer that helper. Browser/CDP is the fallback if the helper cannot start.
- **Observe:** PNG screenshots (action and result), ARIA snapshots, helper stdout, HTTP status/bodies for same-origin pages and `/api/ask-angel-books`, `Content-Type` for PDF downloads. Play progress lives in `localStorage` key `fhb_play_v1`.
- **Isolate:** two Next instances can share the tree if they use different `PORT`s. Verification **must** launch its own instance on `VERIFY_PORT` (default `4173`) and **must refuse** to drive `:3000` or any process it did not start. Playwright uses a fresh browser context (Play stickers stay off the developer's device).

## Launch

From the repo root, after `npm install` and `npx playwright install chromium` (first time only):

```bash
node .cursor/skills/verify-bible-stories-site/scripts/verify.mjs launch
```

Equivalent: `npm run verify -- launch`.

What it does:

- Starts the repo script `npm run dev` with `PORT=${VERIFY_PORT:-4173}` and `BROWSER=none`.
- Writes `.cursor/skills/verify-bible-stories-site/.run/instance.json` (pid, process group, port, base URL, log path).
- Appends Next stdout/stderr to `.cursor/skills/verify-bible-stories-site/.run/next.log`.
- Waits until `http://127.0.0.1:$PORT/` returns HTTP 200 **and** the HTML includes `Bible Stories for Little Hearts`.
- Ready log line from Next looks like `Ready in` / `- Local: http://localhost:4173`.
- If `.run/instance.json` already points at a live pid on that port, launch is a no-op and prints the existing URL.
- If the port answers but is **not** the pid in the instance file, launch **exits 2** and does not drive that process.

Teardown is [Cleanup](#cleanup), not `pkill next`.

Override port: `VERIFY_PORT=4174 node .cursor/skills/verify-bible-stories-site/scripts/verify.mjs launch`.

Do not use `npm run start` for verification unless `npm run build` already succeeded in this run and you are proving the production server. Prefer `npm run dev`.

## Doctor

Read-only. Run this first whenever anything looks off:

```bash
node .cursor/skills/verify-bible-stories-site/scripts/verify.mjs doctor
```

Doctor is green only when **all** of these hold:

1. `.run/instance.json` exists and `pid` is alive (`kill -0`).
2. `http://127.0.0.1:$PORT/` is HTTP 200 and contains `Bible Stories for Little Hearts`.
3. `http://127.0.0.1:$PORT/tonight` is HTTP 200 and contains `Tonight's story`.
4. `http://127.0.0.1:$PORT/api/ask-angel-books` is HTTP 200 JSON with `count > 0` and a `books` array.
5. The listening process is the launched pid or a child of its process group — not an unrelated server on the same port.

On failure, print the failed check and the log tail from `.run/next.log`. Do not drive a red instance. Do not doctor the live production site in place of the local instance.

## Drive

Harness: Playwright Chromium through the helper, against **only** the doctored `baseUrl`.

```bash
node .cursor/skills/verify-bible-stories-site/scripts/verify.mjs drive tonight
```

Other mapped IDs: `homepage-collection`, `book-pages`, `play`, `free-resources`, `ask-angel`.

Recipes with exact handles live in [features/](features/). Stable handles from this repo (use these, not coordinates):

| Handle | Where |
| --- | --- |
| `role=link` name `Home` / `Tonight` / `Churches` / `Free` / `Play` / `About` | `components/SiteNav.tsx` |
| `role=link` name `Bible Stories for Little Hearts` | brand in `SiteNav` |
| `#books` heading `Our Storybook Collection` | `components/BookCollection.tsx` |
| `role=button` name `Trust` (and other theme chips) | `BookCollection` theme filters |
| `role=button` name `Book Order` / `A-Z` | sort chips |
| `role=link` name `Series Map` | jumps to `#series-map` |
| `role=navigation` name `Book collection pages` | pagination |
| `article` + `h3` title + `role=link` wrapping the cover/title | `components/BookCard.tsx` |
| `role=link` name `Find on Amazon →` | book card Amazon CTA |
| `role=link` name `← Back to all books` | `app/book/[slug]/page.tsx` |
| `#peek` text `A bedtime peek` | `components/PeekReader.tsx` |
| `role=button` name `Next page →` / `← Back` | peek pager |
| `role=link` name `Buy on Amazon →` | book page CTA |
| `role=button` name `Read a few pages` | `app/tonight/TonightClient.tsx` |
| `role=button` name `Not this mood? Pick another` | tonight mood flow |
| `role=button` name `Ask Angel - Find your book` / `#ask-angel-btn` | `components/AskAngelWidget.tsx` |
| `role=dialog` name `Ask Angel chat` / `#ask-angel-panel` | widget panel; open class is `open` |
| `#angel-input`, `role=button` name `Send`, `role=button` name `Close` | widget |
| `h1` `Play Corner` | `app/play/page.tsx` |
| `role=button` name `How to play` / `Sound off` / `Little Hearts` / `Peek` | `components/play/DailyPuzzle.tsx` |
| `role=button` name `Puzzle piece N` | puzzle tiles |
| `role=button` name `Dismiss puzzle tutorial` | first-visit overlay |
| Search placeholder `Search printables, Bible stories, trackers, devotionals...` | `components/ResourceCollection.tsx` |
| `role=link` name `Download PDF` | resource cards |
| `role=link` name `Play today's puzzle →` | free-resources promo card |

There is no separate interactive `browser` REPL. To extend a recipe, add steps to `scripts/features/<feature>.mjs` and run `drive <feature>` again. Copy an existing driver rather than inventing a new CLI.

Proof rules:

- Exercise the real UI. Do not set `fhb_play_v1` or tonight state via `localStorage` to fake a solved puzzle or a chosen book.
- Do not call Formspree, Mailchimp, Amazon checkout, or the Ask Angel worker as the proof by themselves. Those are production boundaries. Same-origin `/api/ask-angel-books` is fair. Ask Angel chat is fair if you type in `#angel-input` and wait for a bot bubble (worker **or** the in-script `localFallbackReply`).
- Do not submit the contact form or newsletter form during verification. Prove they render. Contact POST goes to `https://formspree.io/f/xrejvnre`. Newsletter POST goes to Mailchimp with `mode: "no-cors"` and then always routes to `/newsletter/thank-you`.
- Capture the click/type **and** the resulting DOM, not only the last screenshot.
- A map entry with several user entry points is not proven by driving only one of them. Record which entry point you used; report the others as not run.

## Evidence

Default root (survives cleanup):

`.cursor/skills/verify-bible-stories-site/evidence/<YYYYMMDD-HHMMSS>-<feature>/`

Each run directory must contain:

- `doctor.json` — stdout of doctor from this instance
- `notes.md` — feature ID, entry point, base URL, local date used for Tonight/Play
- `01-*.png`, `02-*.png`, … — at least one shot of the action and one of the result, with the brand `Bible Stories for Little Hearts` visible
- `aria.txt` — accessibility snapshot of the exercised region
- For API-backed checks, `ask-angel-books.json` or a PDF `headers.txt`

Do not write proof only under `/tmp` or Playwright's `test-results/`. Those vanish. `.run/` is scratch and **is** deleted on cleanup.

## Cleanup

```bash
node .cursor/skills/verify-bible-stories-site/scripts/verify.mjs cleanup
```

Cleanup sends `SIGTERM` then `SIGKILL` to the process **group** recorded in `.run/instance.json`, waits for the port to free, and deletes `.run/instance.json` plus `.run/next.log`. It does **not** delete `evidence/`. It does not kill by process name. It does not touch a server whose pid is not in the instance file.

If launch/drive fails, run cleanup before the next attempt.

## Helpers

All invocations are from the repo root. The script is executable.

```bash
node .cursor/skills/verify-bible-stories-site/scripts/verify.mjs help
node .cursor/skills/verify-bible-stories-site/scripts/verify.mjs launch
node .cursor/skills/verify-bible-stories-site/scripts/verify.mjs doctor
node .cursor/skills/verify-bible-stories-site/scripts/verify.mjs drive tonight
node .cursor/skills/verify-bible-stories-site/scripts/verify.mjs cleanup
```

`scripts/verify.mjs` is the only helper. Feature recipes live beside it in `scripts/features/`. Do not reverse-engineer flags: `help` prints them.

First-time machine setup (verification scaffolding, not product):

```bash
npm install
npx playwright install chromium
```
