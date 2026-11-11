/** Slim map so /tonight does not pull the full song catalog into the client bundle. */

export type TonightSongPick = { slug: string; title: string };

export const TONIGHT_SONG_BY_BOOK: Record<string, TonightSongPick> = {
  zacchaeus: {
    slug: "zacchaeus-was-a-wee-little-man",
    title: "Zacchaeus Was a Wee Little Man",
  },
  "joshua-and-jericho": {
    slug: "joshua-fought-the-battle-of-jericho",
    title: "Joshua Fought the Battle of Jericho",
  },
  "david-and-the-giant": {
    slug: "little-david-play-on-your-harp",
    title: "Little David, Play on Your Harp",
  },
  "jonah-and-the-big-fish": {
    slug: "jesus-loves-the-little-children",
    title: "Jesus Loves the Little Children",
  },
  "daniel-and-the-lions": {
    slug: "dare-to-be-a-daniel",
    title: "Dare to Be a Daniel",
  },
  "the-christmas-story": {
    slug: "away-in-a-manger",
    title: "Away in a Manger",
  },
};

const DEFAULT_SONG: TonightSongPick = {
  slug: "this-little-light-of-mine",
  title: "This Little Light of Mine",
};

/** Story songs only when the night's book is that story. Noah and every other night use This Little Light of Mine. */
export function songForTonight(bookSlug: string | null | undefined): TonightSongPick {
  if (!bookSlug) return DEFAULT_SONG;
  return TONIGHT_SONG_BY_BOOK[bookSlug] ?? DEFAULT_SONG;
}
