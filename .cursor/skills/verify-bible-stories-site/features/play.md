# Play

Play Corner is a free, accountless daily puzzle: three Bible-story picture puzzles, optional peek, difficulty, and a sticker album stored only in this browser.

## Sub-features

- `play-open` shows `Play Corner` and `Today's three stories`.
- `play-tutorial` can be dismissed (`Dismiss puzzle tutorial`) and reopened with `How to play`.
- `play-tiles` exposes `Puzzle piece 1` … N and swaps two taps.
- `play-peek` holds `Peek` to overlay the finished picture.
- `play-difficulty` toggles `Little Hearts` (2x2) and `Big Hearts` (3x3).
- `play-album` reads/writes `localStorage` key `fhb_play_v1` after a real solve.

## How to get to it (user POV)

- Choose `Play` in the top nav (`PLAY_IS_LIVE` is true in `lib/play/config.ts`).
- From the homepage hero, choose `New! Play today's story puzzle →`.
- From Free Resources, choose `Play today's puzzle →`.
- Open `/play` directly.

## Driving it with verify.mjs

Preconditions:

- Doctor is green.
- Fresh Playwright context so `fhb_play_v1` and `fhb_play_seen_tutorial_v1` start empty.
- Do not pre-seed a solved save.

- **Open.** Run `node .cursor/skills/verify-bible-stories-site/scripts/verify.mjs drive play`. `h1` is `Play Corner`. Text `Today's three stories` is visible. Wait until puzzle tiles exist **or** `Loading today's picture...` resolves. Fail if `Today's picture could not load.`
- **Tutorial.** On a first visit a control `Dismiss puzzle tutorial` may cover the board. Click it (or click `How to play` then dismiss). The overlay leaves and `Puzzle piece 1` is clickable.
- **Peek.** Press and hold `role=button` name `Peek` (`mousedown` / `pointerdown`). The finished picture overlays the board. Release to hide it. Capture mid-hold.
- **Difficulty.** Click `Big Hearts`. The board has nine `Puzzle piece` buttons. Click `Little Hearts` to return to four.
- **Solve (full proof of album).** On 2x2, tap pairs of pieces until the board is solved **or** swap by reading tile order from the DOM and clicking two indices. After solve, a reward region appears. `localStorage.fhb_play_v1` then has `totalSolved >= 1` or a `solvedActivities` key for today. That storage write is the side effect. Do not write the key yourself.
- **Start over.** Only if you must reset: click `Start over`, accept the `confirm` dialog `Start over and clear this sticker album on this device?`. `fhb_play_v1` is removed.
- **Proof.** Screenshots of the loaded board, peek-hold, and (if solved) reward. Dump `fhb_play_v1` into `notes.md` after a real solve. ARIA snapshot of the puzzle section.

## Gotchas

- Analytics on `/play` skip gtag and load `/_vercel/insights/script.js` instead. Ignore that 404 locally.
- Puzzle images live under `/play/puzzles/`. A missing image is a product failure.
- `Sound off` is the default (`sound: false`). Toggling sound is not required proof.
- Practice mode (`Practice puzzles give stars`) appears after all three daily puzzles are solved. Do not claim practice is proven after one daily solve.
- `Start over` is a real `window.confirm`. Headless must accept the dialog explicitly.
- Solving by setting localStorage is not a user path.
- The daily set rotates on the local date. Record `friendlyDate` / the `Today's three stories` date chip.
