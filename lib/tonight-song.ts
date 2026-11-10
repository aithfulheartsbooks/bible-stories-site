/** Slim map so /tonight does not pull the full song catalog into the client bundle. */

export type TonightSongPick = { slug: string; title: string };

const ZACCHAEUS: TonightSongPick = {
  slug: "zacchaeus-was-a-wee-little-man",
  title: "Zacchaeus Was a Wee Little Man",
};

const NOAH: TonightSongPick = {
  slug: "rise-and-shine",
  title: "Rise and Shine (Arky Arky)",
};

const DEFAULT_SONG: TonightSongPick = {
  slug: "this-little-light-of-mine",
  title: "This Little Light of Mine",
};

/** Story songs only when the night's book is that story. Every other night is This Little Light of Mine. */
export function songForTonight(bookSlug: string | null | undefined): TonightSongPick {
  if (bookSlug === "zacchaeus") return ZACCHAEUS;
  if (bookSlug === "noah-and-gods-big-promise") return NOAH;
  return DEFAULT_SONG;
}
