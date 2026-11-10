// One source of truth for the /songs page and Tonight's song strip.
// Lyric text is printed only when a hymnal record or publisher labels it
// public domain (or the traditional first verse the brief allows). Otherwise
// the song is video-only and cannot carry a lyrics field.

export type SongGroupId = "action" | "gentle" | "story";

export type LyricPart =
  | { kind: "line"; text: string }
  | { kind: "label"; text: string };

export type BookLink =
  | { kind: "book"; slug: string; href: string; anchor: string }
  | { kind: "all-books"; href: "/"; anchor: string };

type SongBase = {
  slug: string;
  title: string;
  group: SongGroupId;
  tip: string;
  blurb: string;
  videoId: string;
  channel: string;
  channelUrl: string;
  /** Why this upload is the label's own recording, not a re-upload. */
  videoNote: string;
  /** How embeddability was checked. */
  embedCheck: string;
  /** Why the words are printed, or why they are withheld. */
  lyricsSource: string;
  bookLink?: BookLink;
};

export type LyricsOkSong = SongBase & {
  lyricsStatus: "lyrics-ok";
  lyrics: LyricPart[];
};

export type VideoOnlySong = SongBase & {
  lyricsStatus: "video-only";
};

export type Song = LyricsOkSong | VideoOnlySong;

export const SONG_GROUPS: { id: SongGroupId; title: string; blurb: string }[] = [
  {
    id: "action",
    title: "Action Songs",
    blurb: "Wiggle, clap, march, and shout — songs that get little bodies moving.",
  },
  {
    id: "gentle",
    title: "Gentle Songs",
    blurb: "Quiet songs for bedtime, rocking chairs, and little laps.",
  },
  {
    id: "story",
    title: "Bible Story Songs",
    blurb: "Songs that tell the same stories as the books — sing one, then read it together.",
  },
];

const VEVO = "https://www.youtube.com/@CedarmontKidsVEVO";
const ARTIST = "https://www.youtube.com/@cedarmontkids";
const TOPIC = "https://www.youtube.com/channel/UCus7AIO_DT0rzIs9Emnh7ng";

function embedCheck(channel: string) {
  return `YouTube oEmbed returned HTTP 200 on 2026-11-10 (author ${channel}). The nocookie embed response did not include an owner message that playback on other websites is disabled.`;
}

function vevo(title: string): Pick<SongBase, "channel" | "channelUrl" | "videoNote" | "embedCheck"> {
  return {
    channel: "CedarmontKidsVEVO",
    channelUrl: VEVO,
    videoNote: `Official Cedarmont Kids music video of the label's own recording of ${title}, posted on the CedarmontKidsVEVO channel (Cedarmont Music / Benson), not a fan re-upload.`,
    embedCheck: embedCheck("CedarmontKidsVEVO"),
  };
}

function lyricsOk(song: Omit<LyricsOkSong, "lyricsStatus">): LyricsOkSong {
  return { ...song, lyricsStatus: "lyrics-ok" };
}

function videoOnly(song: Omit<VideoOnlySong, "lyricsStatus">): VideoOnlySong {
  return { ...song, lyricsStatus: "video-only" };
}

const zacchaeusLink: BookLink = {
  kind: "book",
  slug: "zacchaeus",
  href: "/book/zacchaeus",
  anchor: "Read the Zacchaeus story",
};

const noahLink: BookLink = {
  kind: "book",
  slug: "noah-and-gods-big-promise",
  href: "/book/noah-and-gods-big-promise",
  anchor: "Read the Noah and God's Big Promise story",
};

const allBooksLink: BookLink = {
  kind: "all-books",
  href: "/",
  anchor: "Read all the Bible stories",
};

export const songs: Song[] = [
  lyricsOk({
    slug: "this-little-light-of-mine",
    title: "This Little Light of Mine",
    group: "action",
    tip: "Shine it bright — hold up one finger like a little candle.",
    blurb: "A shine-your-light song for little fingers and brave hearts.",
    videoId: "yRhDi2aK5ac",
    ...vevo("This Little Light of Mine"),
    lyricsSource:
      "Hymnary.org text “This little light of mine I'm gonna let it shine” marks Copyright: Public Domain (source African-American). Traditional verses only. https://hymnary.org/text/this_little_light_of_mine_im_gonna_let",
    lyrics: [
      { kind: "line", text: "This little light of mine, I'm gonna let it shine." },
      { kind: "line", text: "This little light of mine, I'm gonna let it shine." },
      { kind: "line", text: "This little light of mine, I'm gonna let it shine." },
      { kind: "line", text: "Let it shine, let it shine, let it shine." },
      { kind: "line", text: "Hide it under a bushel? No! I'm gonna let it shine." },
      { kind: "line", text: "Hide it under a bushel? No! I'm gonna let it shine." },
      { kind: "line", text: "Hide it under a bushel? No! I'm gonna let it shine." },
      { kind: "line", text: "Let it shine, let it shine, let it shine." },
    ],
  }),
  videoOnly({
    slug: "if-youre-happy-and-you-know-it",
    title: "If You're Happy and You Know It",
    group: "action",
    tip: "Clap your hands, then stomp your feet.",
    blurb: "A clap-and-stomp song for wiggly joy.",
    videoId: "kwT0lkYDlAk",
    ...vevo("If You're Happy and You Know It"),
    lyricsSource:
      "In print by 1957, but Jonico Music registered a 1971 copyright crediting Joe Raposo, and Joe Raposo Music still lists the song. Not verified as free to print. https://en.wikipedia.org/wiki/If_You%27re_Happy_and_You_Know_It",
  }),
  videoOnly({
    slug: "father-abraham",
    title: "Father Abraham",
    group: "action",
    tip: "Add one motion each time — arm, arm, foot, foot, then turn.",
    blurb: "The motions pile on until everyone is moving.",
    videoId: "j21aPIbmIts",
    ...vevo("Father Abraham"),
    lyricsSource:
      "Credited to Pierre Kartner (Vader Abraham), published by Universal Music Publishing. Not public domain. https://americansongwriter.com/who-wrote-the-traditional-campfire-song-father-abraham/",
  }),
  videoOnly({
    slug: "deep-and-wide",
    title: "Deep and Wide",
    group: "action",
    tip: "Stretch one way, then the other, and sing with the video.",
    blurb: "A stretch-and-sing song with a steady beat.",
    videoId: "CzAW_sF1Jbs",
    channel: "Cedarmont Kids",
    channelUrl: ARTIST,
    videoNote:
      "Posted on the official Cedarmont Kids artist channel (@cedarmontkids) with the label's own sing-along description and store links. Same recording family as the CedarmontKidsVEVO videos, not a fan re-upload.",
    embedCheck: embedCheck("Cedarmont Kids"),
    lyricsSource:
      "Hymnary.org lists Copyright © 1946 by Herbert G. Tovey. New Spring Publishing / Capitol CMG also claims the song. https://hymnary.org/text/deep_and_wide_deep_and_wide",
  }),
  lyricsOk({
    slug: "ive-got-the-joy",
    title: "I've Got the Joy, Joy, Joy",
    group: "action",
    tip: "Point to your heart each time you sing “down in my heart.”",
    blurb: "Joy, peace, and the love of Jesus — down in your heart.",
    videoId: "8i_IoI9NmW8",
    ...vevo("I've Got the Joy, Joy, Joy"),
    lyricsSource:
      "George W. Cooke, copyrighted 1926 and not renewed. Hymnary.org marks the text Public Domain, and the U.S. term (95 years) ended in 2022. Cooke's verses only. https://hymnary.org/text/i_have_the_joy_joy_joy_joy_down_in_my_h",
    lyrics: [
      { kind: "line", text: "I've got the joy, joy, joy, joy down in my heart," },
      { kind: "line", text: "Down in my heart, down in my heart." },
      { kind: "line", text: "I've got the joy, joy, joy, joy down in my heart," },
      { kind: "line", text: "Down in my heart to stay." },
      { kind: "line", text: "I've got the peace that passeth understanding down in my heart," },
      { kind: "line", text: "Down in my heart, down in my heart." },
      { kind: "line", text: "I've got the peace that passeth understanding down in my heart," },
      { kind: "line", text: "Down in my heart to stay." },
      { kind: "line", text: "I've got the love of Jesus, love of Jesus, down in my heart," },
      { kind: "line", text: "Down in my heart, down in my heart." },
      { kind: "line", text: "I've got the love of Jesus, love of Jesus, down in my heart," },
      { kind: "line", text: "Down in my heart to stay." },
    ],
  }),
  videoOnly({
    slug: "give-me-oil-in-my-lamp",
    title: "Give Me Oil in My Lamp",
    group: "action",
    tip: "Lift your hands like a little lamp.",
    blurb: "A lamp song — sing the chorus with the video.",
    videoId: "1ifsxtehI5M",
    ...vevo("Give Me Oil in My Lamp"),
    lyricsSource:
      "Hymnary.org marks A. Sevison's text Public Domain, but another hymnal shows a 1951 copyright and the two could not be settled. Withheld. https://hymnary.org/text/give_me_oil_in_my_lamp_keep_me_burning",
  }),
  lyricsOk({
    slug: "hallelujah-praise-ye-the-lord",
    title: "Hallelujah, Praise Ye the Lord",
    group: "action",
    tip: "One side sings “hallelu,” the other side answers “praise ye the Lord.”",
    blurb: "A stand-up, sit-down praise song for two sides of the room.",
    videoId: "G1VrEJ5lsnQ",
    channel: "Cedarmont Kids",
    channelUrl: TOPIC,
    videoNote:
      "Official label audio: “Provided to YouTube by Benson — Hallelu, Hallelu · Cedarmont Kids · Gospel Action Songs · ℗ 2000 Cedarmont Music, LLC.” The YouTube Topic upload is the publisher's own master, not a re-upload.",
    embedCheck: embedCheck("Cedarmont Kids - Topic"),
    lyricsSource:
      "Hymnary.org text “Hallelu! Hallelu! Hallelu! Hallelujah! Praise ye the Lord!” Source: Traditional. Copyright: Public Domain. https://hymnary.org/text/hallelu_hallelu_hallelu_hallelujah_prais",
    lyrics: [
      { kind: "line", text: "Hallelu, hallelu, hallelu, hallelujah! Praise ye the Lord!" },
      { kind: "line", text: "Hallelu, hallelu, hallelu, hallelujah! Praise ye the Lord!" },
      { kind: "line", text: "Praise ye the Lord! Hallelujah!" },
      { kind: "line", text: "Praise ye the Lord! Hallelujah!" },
      { kind: "line", text: "Praise ye the Lord! Hallelujah!" },
      { kind: "line", text: "Praise ye the Lord!" },
    ],
  }),
  lyricsOk({
    slug: "the-wise-man-built-his-house",
    title: "The Wise Man Built His House Upon the Rock",
    group: "action",
    tip: "Pound one fist for the rock, then flutter your fingers for the rain.",
    blurb: "The wise man, the foolish man, and the rain coming down.",
    videoId: "3HVdbULOVHA",
    ...vevo("The Wise Man and the Foolish Man"),
    lyricsSource:
      "Ann Omley, 1948. Timeless Truths and R.J. Stevens Music both label this text Public Domain. https://library.timelesstruths.org/music/The_Wise_Man_and_the_Foolish_Man/ and https://www.rjstevensmusic.com/product/the-wise-man/",
    lyrics: [
      { kind: "line", text: "The wise man built his house upon the Rock," },
      { kind: "line", text: "The wise man built his house upon the Rock," },
      { kind: "line", text: "The wise man built his house upon the Rock," },
      { kind: "line", text: "And the rains came tumbling down." },
      { kind: "line", text: "The rains came down and the floods came up," },
      { kind: "line", text: "The rains came down and the floods came up," },
      { kind: "line", text: "The rains came down and the floods came up," },
      { kind: "line", text: "But the house on the Rock stood firm." },
      { kind: "line", text: "The foolish man built his house upon the sand," },
      { kind: "line", text: "The foolish man built his house upon the sand," },
      { kind: "line", text: "The foolish man built his house upon the sand," },
      { kind: "line", text: "And the rains came tumbling down." },
      { kind: "line", text: "The rains came down and the floods came up," },
      { kind: "line", text: "The rains came down and the floods came up," },
      { kind: "line", text: "The rains came down and the floods came up," },
      { kind: "line", text: "And the house on the sand fell flat." },
      { kind: "line", text: "So build your life on the Lord Jesus Christ," },
      { kind: "line", text: "So build your life on the Lord Jesus Christ," },
      { kind: "line", text: "So build your life on the Lord Jesus Christ," },
      { kind: "line", text: "And the blessings will come down." },
      { kind: "line", text: "The blessings come down as your prayers go up," },
      { kind: "line", text: "The blessings come down as your prayers go up," },
      { kind: "line", text: "The blessings come down as your prayers go up," },
      { kind: "line", text: "So build your life on the Lord." },
    ],
  }),
  lyricsOk({
    slug: "jesus-loves-me",
    title: "Jesus Loves Me",
    group: "gentle",
    tip: "Rock gently side to side, or hold your little one close.",
    blurb: "The first song most children ever learn — quiet and sure.",
    videoId: "f1JbSvhw43I",
    ...vevo("Jesus Loves Me"),
    lyricsSource:
      "Anna B. Warner, 1860 (Say and Seal); refrain and tune by William B. Bradbury, 1862. Both long in the public domain. Warner's verses and refrain only. https://hymnary.org/text/jesus_loves_me_this_i_know",
    lyrics: [
      { kind: "line", text: "Jesus loves me, this I know," },
      { kind: "line", text: "For the Bible tells me so." },
      { kind: "line", text: "Little ones to Him belong;" },
      { kind: "line", text: "They are weak, but He is strong." },
      { kind: "label", text: "Chorus" },
      { kind: "line", text: "Yes, Jesus loves me!" },
      { kind: "line", text: "Yes, Jesus loves me!" },
      { kind: "line", text: "Yes, Jesus loves me!" },
      { kind: "line", text: "The Bible tells me so." },
      { kind: "line", text: "Jesus loves me, He who died," },
      { kind: "line", text: "Heaven's gate to open wide." },
      { kind: "line", text: "He will wash away my sin," },
      { kind: "line", text: "Let His little child come in." },
      { kind: "label", text: "Chorus" },
      { kind: "line", text: "Yes, Jesus loves me!" },
      { kind: "line", text: "Yes, Jesus loves me!" },
      { kind: "line", text: "Yes, Jesus loves me!" },
      { kind: "line", text: "The Bible tells me so." },
    ],
  }),
  lyricsOk({
    slug: "jesus-loves-the-little-children",
    title: "Jesus Loves the Little Children",
    group: "gentle",
    tip: "Open your arms wide, as wide as the world.",
    blurb: "Every child, precious in His sight.",
    videoId: "p5LCvWddQHw",
    ...vevo("Jesus Loves the Little Children"),
    lyricsSource:
      "C. H. Woolston, 1912, to George F. Root's 1864 tune. Hymnary.org marks the refrain and the full song Public Domain. Traditional refrain only. https://hymnary.org/text/jesus_loves_the_little_children_all_the",
    lyrics: [
      { kind: "line", text: "Jesus loves the little children," },
      { kind: "line", text: "All the children of the world." },
      { kind: "line", text: "Red and yellow, black and white," },
      { kind: "line", text: "They are precious in His sight." },
      { kind: "line", text: "Jesus loves the little children of the world." },
    ],
  }),
  lyricsOk({
    slug: "hes-got-the-whole-world",
    title: "He's Got the Whole World in His Hands",
    group: "gentle",
    tip: "Cup your hands into a big round world.",
    blurb: "A spiritual for the whole world, the wind, the rain, and the baby.",
    videoId: "b4uNT8a4Q1s",
    ...vevo("He's Got the Whole World in His Hands"),
    lyricsSource:
      "Hymnary.org: Afro-American spiritual, Copyright: Public Domain. Traditional stanzas only. https://hymnary.org/text/hes_got_the_whole_world_in_his_hands",
    lyrics: [
      { kind: "line", text: "He's got the whole world in His hands." },
      { kind: "line", text: "He's got the whole world in His hands." },
      { kind: "line", text: "He's got the whole world in His hands." },
      { kind: "line", text: "He's got the whole world in His hands." },
      { kind: "line", text: "He's got the wind and the rain in His hands." },
      { kind: "line", text: "He's got the wind and the rain in His hands." },
      { kind: "line", text: "He's got the wind and the rain in His hands." },
      { kind: "line", text: "He's got the whole world in His hands." },
      { kind: "line", text: "He's got the little tiny baby in His hands." },
      { kind: "line", text: "He's got the little tiny baby in His hands." },
      { kind: "line", text: "He's got the little tiny baby in His hands." },
      { kind: "line", text: "He's got the whole world in His hands." },
      { kind: "line", text: "He's got you and me, brother, in His hands." },
      { kind: "line", text: "He's got you and me, brother, in His hands." },
      { kind: "line", text: "He's got you and me, brother, in His hands." },
      { kind: "line", text: "He's got the whole world in His hands." },
      { kind: "line", text: "He's got you and me, sister, in His hands." },
      { kind: "line", text: "He's got you and me, sister, in His hands." },
      { kind: "line", text: "He's got you and me, sister, in His hands." },
      { kind: "line", text: "He's got the whole world in His hands." },
      { kind: "line", text: "He's got everybody here in His hands." },
      { kind: "line", text: "He's got everybody here in His hands." },
      { kind: "line", text: "He's got everybody here in His hands." },
      { kind: "line", text: "He's got the whole world in His hands." },
    ],
  }),
  lyricsOk({
    slug: "praise-him-praise-him",
    title: "Praise Him, Praise Him, Little Ones",
    group: "gentle",
    tip: "Clap softly, then fold your hands when you sing “God is love.”",
    blurb: "Praise Him, love Him, thank Him — God is love.",
    videoId: "Srbmk3zrsss",
    channel: "Cedarmont Kids",
    channelUrl: TOPIC,
    videoNote:
      "Official label audio: “Provided to YouTube by Benson — Praise Him, Praise Him All Ye Little Children · Cedarmont Kids · Gospel Singalong Collection · ℗ 2000 Benson Records.” The publisher's own master on the artist Topic channel.",
    embedCheck: embedCheck("Cedarmont Kids - Topic"),
    lyricsSource:
      "Hymnary.org: anonymous text, tune BONNER by Carey Bonner, Copyright: Public Domain. https://hymnary.org/text/praise_him_praise_him_all_ye_little_chil",
    lyrics: [
      { kind: "line", text: "Praise Him, praise Him, all ye little children," },
      { kind: "line", text: "God is love, God is love." },
      { kind: "line", text: "Praise Him, praise Him, all ye little children," },
      { kind: "line", text: "God is love, God is love." },
      { kind: "line", text: "Love Him, love Him, all ye little children," },
      { kind: "line", text: "God is love, God is love." },
      { kind: "line", text: "Love Him, love Him, all ye little children," },
      { kind: "line", text: "God is love, God is love." },
      { kind: "line", text: "Thank Him, thank Him, all ye little children," },
      { kind: "line", text: "God is love, God is love." },
      { kind: "line", text: "Thank Him, thank Him, all ye little children," },
      { kind: "line", text: "God is love, God is love." },
    ],
  }),
  videoOnly({
    slug: "be-careful-little-eyes",
    title: "Be Careful, Little Eyes",
    group: "gentle",
    tip: "Point to eyes, ears, hands, and feet.",
    blurb: "A quiet reminder song for little eyes, ears, hands, and feet.",
    videoId: "PsTWc_tAGts",
    ...vevo("O Be Careful Little Eyes"),
    lyricsSource:
      "Hymnary.org lists Copyright © 1944 by Zondervan Music Publishers. Words withheld. https://hymnary.org/text/o_be_careful_little_eyes_what_you_see",
  }),
  lyricsOk({
    slug: "zacchaeus-was-a-wee-little-man",
    title: "Zacchaeus Was a Wee Little Man",
    group: "story",
    tip: "Climb your hands up high, then call him down from the tree.",
    blurb: "He climbed up in a sycamore tree — from Luke 19.",
    videoId: "C8GJXE7e5s0",
    ...vevo("Zacchaeus"),
    bookLink: zacchaeusLink,
    lyricsSource:
      "First verse only. Hymnary Songs for Life and Sing With Me mark stanza 1 Traditional and credit a later stanza to Herman Proper (withheld). Earliest printing found: Action (1944), author unknown. https://hymnary.org/text/zacchaeus_was_a_wee_little_man",
    lyrics: [
      { kind: "line", text: "Zacchaeus was a wee little man," },
      { kind: "line", text: "And a wee little man was he." },
      { kind: "line", text: "He climbed up in a sycamore tree" },
      { kind: "line", text: "For the Lord he wanted to see." },
      { kind: "line", text: "And as the Savior passed that way" },
      { kind: "line", text: "He looked up in the tree," },
      { kind: "line", text: "And he said, “Zacchaeus, you come down," },
      { kind: "line", text: "For I'm going to your house today.”" },
    ],
  }),
  videoOnly({
    slug: "rise-and-shine",
    title: "Rise and Shine (Arky Arky)",
    group: "story",
    tip: "Stretch up tall, then shine your hands out wide.",
    blurb: "Noah's rainy-day song — sing it, then read the story.",
    videoId: "56QWeYtHW0k",
    ...vevo("Rise and Shine (Arky, Arky)"),
    bookLink: noahLink,
    lyricsSource:
      "The children's Noah verses have no identified author, and Music Services lists a 2009 copyright (Rick Altizer, CCLI 5022102) on this lyric. Withheld. https://app.musicservices.com/license/song/detail/180952",
  }),
  videoOnly({
    slug: "who-built-the-ark",
    title: "Who Built the Ark?",
    group: "story",
    tip: "A question, then everybody answers — sing it with the video.",
    blurb: "A call-and-answer Noah song to sing with the story.",
    videoId: "nc6wrjcKdac",
    ...vevo("Who Built the Ark?"),
    bookLink: noahLink,
    lyricsSource:
      "The children's “Who built the ark? Noah, Noah” text is licensed from Ruth Crawford Seeger's American Folk Songs for Children (Doubleday), not the different 1916 spiritual. Withheld. https://hymnary.org/text/now_didnt_old_noah_build_the_ark",
  }),
  lyricsOk({
    slug: "the-b-i-b-l-e",
    title: "The B-I-B-L-E",
    group: "story",
    tip: "Spell the letters in the air, one for each finger.",
    blurb: "Yes, that's the book for me — spell it out loud and proud.",
    videoId: "8a1amee1gW0",
    ...vevo("The B-I-B-L-E"),
    bookLink: allBooksLink,
    lyricsSource:
      "Hymnary.org and The Cyber Hymnal mark the anonymous short verse Public Domain. First known printing is a 1934 Covenant hymnal with no author. Longer added verses are omitted. https://hymnary.org/text/the_b_i_b_l_e_yes_thats_the_book",
    lyrics: [
      { kind: "line", text: "The B-I-B-L-E," },
      { kind: "line", text: "Yes, that's the Book for me." },
      { kind: "line", text: "I stand alone on the Word of God," },
      { kind: "line", text: "The B-I-B-L-E." },
    ],
  }),
];

export const DEFAULT_SONG_SLUG = "this-little-light-of-mine";

export { songForTonight } from "@/lib/tonight-song";

export function songsInGroup(group: SongGroupId) {
  return songs.filter((song) => song.group === group);
}

export function findSong(slug: string | undefined | null): Song {
  return songs.find((song) => song.slug === slug) ?? songs[0];
}

export function lyricPlainText(song: Song) {
  if (song.lyricsStatus !== "lyrics-ok") return "";
  return song.lyrics
    .map((part) => (part.kind === "label" ? part.text.toUpperCase() : part.text))
    .join("\n");
}

export function songSearchText(song: Song) {
  return [song.title, song.tip, lyricPlainText(song), song.bookLink?.anchor ?? ""]
    .join(" ")
    .toLowerCase();
}
