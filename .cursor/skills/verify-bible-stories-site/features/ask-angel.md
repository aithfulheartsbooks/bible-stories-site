# Ask Angel

Ask Angel is a fixed chat widget that recommends books and explains site sections. It loads the live book list from this origin, then talks to a Cloudflare worker, with an in-script fallback if the worker fails.

## Sub-features

- `angel-open` toggles the dialog from `Ask Angel - Find your book`.
- `angel-close` hides the dialog with `Close`.
- `angel-books-api` loads `GET /api/ask-angel-books` when the panel opens.
- `angel-send` types a question and shows a user bubble plus a bot bubble.
- `angel-fallback` still answers when the worker at `https://ask-angel.ruhezhao.workers.dev` errors.

## How to get to it (user POV)

- On any public page, choose the gold circular button at the bottom-right (accessible name `Ask Angel - Find your book`).
- There is no standalone `/ask-angel` route.

## Driving it with verify.mjs

Preconditions:

- Doctor is green (includes the books API check).
- Prefer `/` so the homepage brand is in screenshots.

- **Open.** Run `node .cursor/skills/verify-bible-stories-site/scripts/verify.mjs drive ask-angel`. Click `role=button` name `Ask Angel - Find your book`. `#ask-angel-panel` has class `open`. `role=dialog` name `Ask Angel chat` is visible. The first bot bubble contains `I am Angel`.
- **Books API.** While opening, the widget fetches `origin + '/api/ask-angel-books'`. A 200 JSON body with `count > 0` is required. Save that body as `ask-angel-books.json`.
- **Send.** Fill `#angel-input` with `how many books`. Click `role=button` name `Send`. A user bubble with that text appears, then a bot bubble. The fallback path answers `There are **N books** currently available in the series.` (rendered as bold, no markdown heading). Either worker text or that fallback counts, as long as a bot bubble arrived after the user bubble.
- **Close.** Click `role=button` name `Close`. `#ask-angel-panel` does not have class `open`.
- **Proof.** Screenshot of the closed page with the FAB visible, screenshot of the open greeting, screenshot after the reply. ARIA snapshot of `[role=dialog]`. Record whether the worker HTTP status was 200 or the fallback ran.

## Gotchas

- The worker is a production boundary. Do not treat a worker outage as a product failure if `localFallbackReply` still answers. Do treat a missing user or bot bubble as a failure.
- `#ask-angel-btn` is `position: fixed` with `z-index: 9999`. It can sit on top of footer links and Play controls. Use the accessible name, not a click at the bottom-right corner of a screenshot.
- The widget script is injected with `dangerouslySetInnerHTML` and guards on `window.__askAngelInitialized`. A Next client re-render should not mount a second copy; if two FABs appear, that is a bug.
- Input `maxlength` is 300. Placeholder returns to `e.g. my 5 year old loves animals...` after books load.
- Do not use the inlined `getBuiltInBooks()` list as the source of truth when the API succeeded. The API is the live catalog.
- Never invent a book that is not in the API response.
