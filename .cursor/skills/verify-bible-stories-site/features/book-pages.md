# Book pages

Each available book has a public page at `/book/[slug]` with cover, blurb, a four-page peek, an Amazon CTA, and sometimes a Sing Along YouTube embed.

## Sub-features

- `book-open` renders the title, number, blurb, and cover for a real slug from `app/books.ts`.
- `book-peek` shows `#peek` with `A bedtime peek · 1 of 4` and pages with `Next page →`.
- `book-amazon` exposes `Buy on Amazon →` for available books that have `amazonUrl`.
- `book-song` shows the Sing Along region when `book.song` exists (`aria-labelledby=book-song-heading`).
- `book-back` returns to the collection via `← Back to all books`.

## How to get to it (user POV)

- From the homepage grid, choose a book cover or title.
- From the Series Map, choose a timeline tile.
- Open `/book/noah-and-gods-big-promise` (stable first published slug).
- From Tonight, choose `Open the book page`.
- From Ask Angel, follow a book-page link the widget prints.

## Driving it with verify.mjs

Preconditions:

- Doctor is green.
- Use slug `noah-and-gods-big-promise` unless the change under test is another book.

- **Deep link.** Run `node .cursor/skills/verify-bible-stories-site/scripts/verify.mjs drive book-pages`. `h1` is `Noah and God's Big Promise`. The number badge `Book 01` is visible.
- **Collection entry.** From `/`, click the card link whose name includes `Noah and God's Big Promise`. Same `h1`.
- **Peek.** `#peek` contains `A bedtime peek · 1 of`. Click `role=button` name `Next page →`. The label becomes `2 of`. `← Back` is enabled after the first advance.
- **Amazon.** `role=link` name `Buy on Amazon →` has `target=_blank` and `href` containing `amazon.com`. Do not follow it through checkout.
- **Back.** Click `← Back to all books`. Land on `/` with `#books` present.
- **Proof.** Screenshot of the heading + peek page 1, screenshot after `Next page →`, ARIA snapshot of `#peek`. Record the slug.

## Gotchas

- Unknown slugs 404. Do not invent slugs; read them from `app/books.ts`.
- Coming-soon slugs may still have pages but must not be used as the happy path.
- Peek copy comes from `lib/peeks.ts` (and split files). If `#peek` is missing, `peekFor` returned nothing — that is a product bug, not a reason to skip.
- Sing Along is an iframe to `youtube.com/embed/...`. Prove the heading and iframe `title`, not that YouTube played.
- Interactive story emoji buttons (`SoundButton`) play audio. Do not treat sound as required proof in a headless run.
- Ask Angel and the fixed nav sit above the page. Click names, not the bottom-right of the viewport.
