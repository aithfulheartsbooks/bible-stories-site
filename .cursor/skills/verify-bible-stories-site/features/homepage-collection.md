# Homepage collection

The homepage shows the series, lets a visitor filter and sort the grid, page through cards, jump to the Series Map, and open an available book.

## Sub-features

- `home-hero` shows the series title and the Tonight / Play entry CTAs.
- `theme-filter` narrows `#books` to a theme chip such as `Trust`.
- `sort-az` reorders visible cards when `A-Z` is chosen.
- `pagination` moves `#books` via `Book collection pages` when more than one page exists.
- `series-map` lists Old Testament and New Testament books with scripture references.
- `open-book-card` follows an available card into `/book/[slug]`.

## How to get to it (user POV)

- Open `/` directly.
- Choose `Home` in the top nav from any other page.
- Choose the brand link `Bible Stories for Little Hearts` (homepage uses `href="#top"`).
- From Play, choose `See the book collection` (`/#books`).
- From Churches, choose `See the full series` (`/#books`).

## Driving it with verify.mjs

Preconditions:

- Doctor is green at the launched `baseUrl`.
- Start at `/` unless proving a named inbound link.

- **Hero.** Run `node .cursor/skills/verify-bible-stories-site/scripts/verify.mjs drive homepage-collection`. The first heading is `Bible Stories` with italic `for Little Hearts`. A link `Not sure what to read tonight?` points at `/tonight`. A link `New! Play today's story puzzle →` points at `/play`.
- **Collection.** Wait for `#books` and heading `Our Storybook Collection`. At least one `article` contains `Find on Amazon →`.
- **Theme filter.** Click `role=button` name `Trust`. The first available card still in view includes theme text `Trust` (for example `Noah and God's Big Promise`). Capture this state before clearing.
- **Sort.** Click `role=button` name `A-Z`. The first available `h3` is alphabetically at or before later cards. Click `Book Order` to restore publication order.
- **Pagination.** If `role=navigation` name `Book collection pages` exists, click `Next`. The URL gains `?booksPage=2` and `#books` still has cards. Click `Previous` to return.
- **Series Map.** Click `role=link` name `Series Map`. `#series-map` is in view with headings `Old Testament` and `New Testament`. A map tile is a link to `/book/noah-and-gods-big-promise` (or another live slug).
- **Open a book.** Click the cover/title link for `Noah and God's Big Promise` (`/book/noah-and-gods-big-promise`). The book-page `h1` is that title. This sub-feature is the handoff to [book-pages.md](./book-pages.md).
- **Proof.** Screenshots of unfiltered `#books`, the `Trust` filter, and `#series-map`. ARIA snapshot of `#books`. `notes.md` records the entry point (`/` vs `#books`).

## Gotchas

- Theme and sort state is client-only. A full reload resets to `All Books` and `Book Order`.
- Pagination writes `booksPage` with `router.replace` and scrolls to `#books`. Do not assert `window.scrollY`; assert the query and visible cards.
- Cards with title `Coming Soon` are not links. Only `status === "available"` cards wrap in `<Link href="/book/...">`.
- Desktop shows 18 cards per page, viewport `<600px` shows 9. Do not hard-code page count.
- Amazon links leave the origin. Prove `href` contains `amazon.com`. Do not complete a purchase.
- Homepage brand href is `#top`, not `/`. From another route the brand href is `/`.
