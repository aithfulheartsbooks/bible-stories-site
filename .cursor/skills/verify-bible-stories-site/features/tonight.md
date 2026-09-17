# Tonight

Tonight picks one available picture book from the visitor's local calendar date, lets them read a four-page peek, and can suggest three other books from a mood + story-kind picker.

## Sub-features

- `tonight-nightly` hydrates a cover, title, and `Tonight - <weekday month day>` after mount.
- `tonight-peek` opens sample pages with `Read a few pages`.
- `tonight-book-page` follows `Open the book page` to `/book/[slug]`.
- `tonight-mood` runs `Not this mood? Pick another` through a mood and a lens to `Three books for this mood`.
- `tonight-share` shows a caption and `Copy caption` (clipboard may be denied in headless).

## How to get to it (user POV)

- Choose `Tonight` in the top nav.
- From the homepage hero, choose `Not sure what to read tonight?`.
- Open `/tonight` directly.

## Driving it with verify.mjs

Preconditions:

- Doctor is green.
- Local date is whatever the browser uses. Record it in `notes.md`. The pick is `todaysBook(new Date())` over available books with Amazon URLs (`lib/tonight.ts`).

- **Nav entry.** From `/`, click `role=link` name `Tonight`. The URL is `/tonight`. `h1` is `Tonight's story`.
- **Nightly hydrate.** Wait until an `h2` under the featured section is a real book title (not the empty cream placeholder). The line `Tonight -` is visible. Capture this screenshot — it is the action's first result.
- **Peek.** Click `role=button` name `Read a few pages`. `#peek` appears (or scrolls into view) with `A bedtime peek · 1 of`. Click `Next page →` and assert `2 of`.
- **Book page (optional in a one-feature run).** Click `Open the book page`. The book-page `h1` matches tonight's `h2`.
- **Mood picker (second entry, not a substitute for nightly).** Click `Not this mood? Pick another`. Click `Brave and ready`, then `Stories of Jesus`. Heading `Three books for this mood` appears with three cards. Click a card's `Read a few pages` and assert `#peek` mentions that book's title (`Sample pages from` when it differs from tonight).
- **Share.** The `Share tonight's story` region contains `https://www.faithfulheartsbooks.com/tonight`. Click `Copy caption`. If the button text becomes `Copied`, clipboard write succeeded; if it stays `Copy caption`, the browser blocked clipboard — still pass if the caption text is on the page.
- **Proof.** Screenshots: featured book, peek page 1, peek page 2. ARIA snapshot of `#peek`. `notes.md` names the nightly title and the entry point (`nav` vs hero vs `/tonight`).

Command for the default recipe (nav → nightly → peek):

```bash
node .cursor/skills/verify-bible-stories-site/scripts/verify.mjs drive tonight
```

## Gotchas

- The featured book is empty until `useEffect` runs. Do not screenshot immediately on `h1`.
- The book changes at local midnight. Do not hard-code a title. Assert that the `h2` is non-empty and matches an available book from `/api/ask-angel-books`.
- `Keep tonight's pick` resets mood state. Use it if a previous step left the picker open.
- Peek `Get the picture book →` appears on the last page and is an Amazon link. Do not follow it.
- Clipboard in Chromium needs a granted permission or a secure context; visible caption text is the side-effect proof when copy is blocked.
- Hero CTA copy is `Not sure what to read tonight?`. Mood CTA copy is `Not this mood? Pick another`. They are different controls.
