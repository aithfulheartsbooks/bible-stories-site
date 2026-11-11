import { songCueTimes } from "@/lib/song-cue-times";

// One source of truth for the /songs page and Tonight's song strip.
// Lyric text is printed only when a hymnal record or publisher labels it
// public domain (or the traditional first verse the brief allows). Otherwise
// the song is video-only and cannot carry a lyrics field.

export type SongGroupId = "action" | "gentle" | "story";

export type LyricPart =
  | { kind: "line"; text: string }
  | { kind: "label"; text: string };

/**
 * A printed line (labels are not counted), timed to this song's videoId.
 * The same line index may appear again when the recording repeats it.
 * Starts stay in order. A stretch with no cue, including an unprinted verse,
 * is not highlighted.
 */
export type LyricCue = {
  line: number;
  start: number;
};

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
  /**
   * Optional timing for videoId. Leave it off when captions or alignment
   * could not be derived — the words stay readable and are not highlighted.
   * Add cues with `python scripts/align-songs.py <videoId> --lines lines.txt`.
   */
  cues?: LyricCue[];
  /** Seconds. Required whenever cues are present. */
  videoDuration?: number;
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
const TOPIC = "https://www.youtube.com/channel/UCus7AIO_DT0rzIs9Emnh7ng";
const LISTENER = "https://www.youtube.com/@listenerkids";

function embedCheck(channel: string) {
  return `YouTube oEmbed returned HTTP 200 on 2026-11-10 (author ${channel}). The nocookie embed response did not include an owner message that playback on other websites is disabled.`;
}

function lyricsOk(song: Omit<LyricsOkSong, "lyricsStatus">): LyricsOkSong {
  return { ...song, lyricsStatus: "lyrics-ok" };
}

function book(slug: string, title: string): BookLink {
  return { kind: "book", slug, href: `/book/${slug}`, anchor: `Read the ${title} story` };
}

const allBooksLink: BookLink = {
  kind: "all-books",
  href: "/",
  anchor: "Read all the Bible stories",
};

function vevo(title: string): Pick<SongBase, "channel" | "channelUrl" | "videoNote" | "embedCheck"> {
  return {
    channel: "CedarmontKidsVEVO",
    channelUrl: VEVO,
    videoNote: `Official Cedarmont Kids recording of ${title} on CedarmontKidsVEVO (Cedarmont Music / Benson).`,
    embedCheck: embedCheck("CedarmontKidsVEVO"),
  };
}

function topic(title: string): Pick<SongBase, "channel" | "channelUrl" | "videoNote" | "embedCheck"> {
  return {
    channel: "Cedarmont Kids",
    channelUrl: TOPIC,
    videoNote: `Official label audio of ${title}: Provided to YouTube by Benson, Cedarmont Kids master, lyricist Traditional. No newer official picture video was found that sings this text.`,
    embedCheck: embedCheck("Cedarmont Kids - Topic"),
  };
}

function listener(title: string): Pick<SongBase, "channel" | "channelUrl" | "videoNote" | "embedCheck"> {
  return {
    channel: "Listener Kids",
    channelUrl: LISTENER,
    videoNote: `Official Listener Kids recording of ${title} on the Listener Kids channel.`,
    embedCheck: embedCheck("Listener Kids"),
  };
}

export const songs: Song[] = [
  lyricsOk({
    slug: "this-little-light-of-mine",
    title: "This Little Light of Mine",
    group: "action",
    tip: "Hold up one finger like a little candle and let it shine.",
    blurb: "A shine-your-light song for little fingers.",
    videoId: "Xe_1XJsjMZY",
    ...vevo("This Little Light of Mine"),
    lyricsSource:
      "Hymnary.org marks the traditional text Public Domain. The July 15, 2021 CedarmontKidsVEVO description sings these verses (bushel, Satan, till Jesus comes). https://hymnary.org/text/this_little_light_of_mine_im_gonna_let",
    lyrics: [
      { kind: "line", text: "This little light of mine, I'm gonna let it shine." },
      { kind: "line", text: "This little light of mine, I'm gonna let it shine." },
      { kind: "line", text: "This little light of mine, I'm gonna let it shine." },
      { kind: "line", text: "Let it shine, let it shine, let it shine." },
      { kind: "line", text: "Hide it under a bushel? No! I'm gonna let it shine." },
      { kind: "line", text: "Hide it under a bushel? No! I'm gonna let it shine." },
      { kind: "line", text: "Hide it under a bushel? No! I'm gonna let it shine." },
      { kind: "line", text: "Let it shine, let it shine, let it shine." },
      { kind: "line", text: "Don't let Satan blow it out! I'm gonna let it shine." },
      { kind: "line", text: "Don't let Satan blow it out! I'm gonna let it shine." },
      { kind: "line", text: "Don't let Satan blow it out! I'm gonna let it shine." },
      { kind: "line", text: "Let it shine, let it shine, let it shine." },
      { kind: "line", text: "Let it shine till Jesus comes, I'm gonna let it shine." },
      { kind: "line", text: "Let it shine till Jesus comes, I'm gonna let it shine." },
      { kind: "line", text: "Let it shine till Jesus comes, I'm gonna let it shine." },
      { kind: "line", text: "Let it shine, let it shine, let it shine." },
    ],
  }),
  lyricsOk({
    slug: "ive-got-the-joy",
    title: "I've Got the Joy, Joy, Joy",
    group: "action",
    tip: "Point to your heart each time you sing down in my heart.",
    blurb: "Joy, peace, and the love of Jesus.",
    videoId: "8i_IoI9NmW8",
    ...vevo("Down in My Heart"),
    lyricsSource:
      "George W. Cooke, 1926, copyright not renewed; Hymnary Public Domain, including the refrain And I'm so happy. The recording sings Cooke's I have, not I've got. https://hymnary.org/text/i_have_the_joy_joy_joy_joy_down_in_my_h",
    lyrics: [
      { kind: "line", text: "I have the joy, joy, joy, joy down in my heart," },
      { kind: "line", text: "Down in my heart, down in my heart." },
      { kind: "line", text: "I have the joy, joy, joy, joy down in my heart," },
      { kind: "line", text: "Down in my heart to stay." },
      { kind: "label", text: "Refrain" },
      { kind: "line", text: "And I'm so happy, so very happy," },
      { kind: "line", text: "I have the love of Jesus in my heart." },
      { kind: "line", text: "I have the love of Jesus, love of Jesus, down in my heart," },
      { kind: "line", text: "Down in my heart, down in my heart." },
      { kind: "line", text: "I have the love of Jesus, love of Jesus, down in my heart," },
      { kind: "line", text: "Down in my heart to stay." },
      { kind: "line", text: "I have the peace that passeth understanding down in my heart." },
    ],
  }),
  lyricsOk({
    slug: "hallelujah-praise-ye-the-lord",
    title: "Hallelujah, Praise Ye the Lord",
    group: "action",
    tip: "One side sings hallelu, the other side answers praise ye the Lord.",
    blurb: "A stand-up, sit-down praise song.",
    videoId: "G1VrEJ5lsnQ",
    ...topic("Hallelu, Hallelu"),
    lyricsSource:
      "Hymnary.org: Traditional, Public Domain. https://hymnary.org/text/hallelu_hallelu_hallelu_hallelujah_prais Benson labels this Cedarmont master Traditional. Listener Kids' newer upload is titled NEW VERSION and its words were not verified, so it was not used.",
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
    slug: "jesus-wants-me-for-a-sunbeam",
    title: "Jesus Wants Me for a Sunbeam",
    group: "action",
    tip: "Stretch up like a sunbeam, then shine your hands out wide.",
    blurb: "I'll be a sunbeam for Him.",
    videoId: "UYWWBnAepes",
    ...vevo("Jesus Wants Me For a Sunbeam"),
    lyricsSource:
      "Nellie Talbot and E. O. Excell, 1900. Hymnary: Public Domain. https://hymnary.org/text/jesus_wants_me_for_a_sunbeam The Feb 11, 2021 CedarmontKidsVEVO description sings these verses. A 2025 Listener Kids upload was newer, but its sung words were not on the page.",
    lyrics: [
      { kind: "line", text: "Jesus wants me for a sunbeam, to shine for Him each day;" },
      { kind: "line", text: "In every way try to please Him, at home, at school, at play." },
      { kind: "label", text: "Refrain" },
      { kind: "line", text: "A sunbeam, a sunbeam, Jesus wants me for a sunbeam;" },
      { kind: "line", text: "A sunbeam, a sunbeam, I'll be a sunbeam for Him." },
      { kind: "line", text: "Jesus wants me to be loving, and kind to all I see;" },
      { kind: "line", text: "Showing how pleasant and happy His little one can be." },
      { kind: "line", text: "I'll be a sunbeam for Jesus, I can if I but try;" },
      { kind: "line", text: "Serving Him moment by moment, then live with Him on high." },
    ],
  }),
  lyricsOk({
    slug: "do-lord",
    title: "Do Lord",
    group: "action",
    tip: "Clap on each Do Lord, then point beyond the blue.",
    blurb: "Do Lord, O do Lord, O do remember me.",
    videoId: "FCXvjx-nP9g",
    ...vevo("Do Lord"),
    lyricsSource:
      "Traditional spiritual. Hymnary: Public Domain. https://hymnary.org/text/do_lord_do_lord_do_remember_me The Apr 15, 2021 CedarmontKidsVEVO description sings these verses. A newer Listener Kids upload did not print its words.",
    lyrics: [
      { kind: "line", text: "Do Lord, O do Lord, O do remember me," },
      { kind: "line", text: "Do Lord, O do Lord, O do remember me," },
      { kind: "line", text: "Do Lord, O do Lord, O do remember me," },
      { kind: "line", text: "Look away beyond the blue." },
      { kind: "line", text: "I've got a home in glory land that outshines the sun," },
      { kind: "line", text: "I've got a home in glory land that outshines the sun," },
      { kind: "line", text: "I've got a home in glory land that outshines the sun," },
      { kind: "line", text: "Look away beyond the blue." },
      { kind: "line", text: "I took Jesus as my Savior, you take Him too," },
      { kind: "line", text: "I took Jesus as my Savior, you take Him too," },
      { kind: "line", text: "I took Jesus as my Savior, you take Him too," },
      { kind: "line", text: "Look away beyond the blue." },
    ],
  }),
  lyricsOk({
    slug: "ive-got-peace-like-a-river",
    title: "I've Got Peace Like a River",
    group: "action",
    tip: "Smooth hands for the river, wide arms for the ocean, then a little fountain.",
    blurb: "Peace, love, and joy.",
    videoId: "A9xOG-v0LzU",
    ...vevo("I've Got Peace Like a River"),
    lyricsSource:
      "Traditional spiritual. Hymnary: Public Domain. https://hymnary.org/text/ive_got_peace_like_a_river The June 3, 2021 CedarmontKidsVEVO description sings these verses, including the peace-love-and-joy line.",
    lyrics: [
      { kind: "line", text: "I've got peace like a river, I've got peace like a river," },
      { kind: "line", text: "I've got peace like a river in my soul." },
      { kind: "line", text: "I've got love like an ocean, I've got love like an ocean," },
      { kind: "line", text: "I've got love like an ocean in my soul." },
      { kind: "line", text: "I've got joy like a fountain, I've got joy like a fountain," },
      { kind: "line", text: "I've got joy like a fountain in my soul." },
      { kind: "line", text: "I've got peace, love, and joy like a river in my soul." },
    ],
  }),
  lyricsOk({
    slug: "wide-wide-as-the-ocean",
    title: "Wide, Wide as the Ocean",
    group: "action",
    tip: "Stretch your arms as wide as the ocean.",
    blurb: "Deep, deep as the deepest sea is my Savior's love.",
    videoId: "Ri-StyOL1I4",
    ...vevo("Wide, Wide as the Ocean"),
    lyricsSource:
      "Charles Austin Miles, 1914. Hymnary: Public Domain. https://hymnary.org/text/wide_wide_as_the_ocean The Apr 6, 2023 CedarmontKidsVEVO page is the official recording of this title. Its description did not reprint the lyric.",
    lyrics: [
      { kind: "line", text: "Wide, wide as the ocean, high as the heavens above;" },
      { kind: "line", text: "Deep, deep as the deepest sea is my Savior's love." },
      { kind: "line", text: "I, though so unworthy, still am a child of His care," },
      { kind: "line", text: "For His Word teaches me that His love reaches me everywhere." },
    ],
  }),
  lyricsOk({
    slug: "jesus-loves-me",
    title: "Jesus Loves Me",
    group: "gentle",
    tip: "Rock gently side to side, or hold your little one close.",
    blurb: "The first song most children ever learn.",
    videoId: "f1JbSvhw43I",
    ...vevo("Jesus Loves Me"),
    lyricsSource:
      "Anna B. Warner, 1860; William B. Bradbury refrain, 1862. The recording sings verse 1 and the refrain. The middle of the track is a different children's verse, so Warner's He who died stanza stays printed and is not highlighted.",
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
    ],
  }),
  lyricsOk({
    slug: "hes-got-the-whole-world",
    title: "He's Got the Whole World in His Hands",
    group: "gentle",
    tip: "Cup your hands into a big round world.",
    blurb: "The whole world, the wind, the rain, and the baby.",
    videoId: "b4uNT8a4Q1s",
    ...vevo("He's Got the Whole World in His Hands"),
    lyricsSource:
      "Traditional spiritual. Hymnary: Public Domain. https://hymnary.org/text/hes_got_the_whole_world_in_his_hands The Apr 8, 2021 CedarmontKidsVEVO description sings these verses. A 2025 Listener Kids upload also sings an added line, We've got the love of Jesus in our hearts, so it was not used.",
    lyrics: [
      { kind: "line", text: "He's got the whole world in His hands." },
      { kind: "line", text: "He's got the wind and the rain in His hands." },
      { kind: "line", text: "He's got the little bitty baby in His hands." },
      { kind: "line", text: "He's got you and me, brother, in His hands." },
      { kind: "line", text: "He's got you and me, sister, in His hands." },
      { kind: "line", text: "He's got the whole world in His hands." },
    ],
  }),
  lyricsOk({
    slug: "praise-him-praise-him",
    title: "Praise Him, Praise Him, Little Ones",
    group: "gentle",
    tip: "Clap softly, then fold your hands when you sing God is love.",
    blurb: "Praise Him, love Him, thank Him.",
    videoId: "Srbmk3zrsss",
    ...topic("Praise Him, All Ye Little Children"),
    lyricsSource:
      "Anonymous text, tune BONNER by Carey Bonner. Hymnary: Public Domain, including Serve Him. https://hymnary.org/text/praise_him_praise_him_all_ye_little_chil The Cedarmont topic recording sings Praise, Love, Thank, and Serve.",
    lyrics: [
      { kind: "line", text: "Praise Him, praise Him, all ye little children," },
      { kind: "line", text: "God is love, God is love." },
      { kind: "line", text: "Love Him, love Him, all ye little children," },
      { kind: "line", text: "God is love, God is love." },
      { kind: "line", text: "Thank Him, thank Him, all ye little children," },
      { kind: "line", text: "God is love, God is love." },
      { kind: "line", text: "Serve Him, serve Him, all ye little children," },
      { kind: "line", text: "God is love, God is love." },
    ],
  }),
  lyricsOk({
    slug: "jesus-loves-even-me",
    title: "Jesus Loves Even Me",
    group: "gentle",
    tip: "Hug your arms close on even me.",
    blurb: "I am so glad that Jesus loves me.",
    videoId: "DnJ65AKkRaE",
    ...vevo("Jesus Loves Even Me"),
    lyricsSource:
      "P. P. Bliss, 1871. Hymnary: Public Domain. https://hymnary.org/text/i_am_so_glad_that_our_father_in_heaven The Feb 18, 2021 CedarmontKidsVEVO description sings these verses.",
    lyrics: [
      { kind: "label", text: "Refrain" },
      { kind: "line", text: "I am so glad that Jesus loves me," },
      { kind: "line", text: "Jesus loves me, Jesus loves me." },
      { kind: "line", text: "I am so glad that Jesus loves me," },
      { kind: "line", text: "Jesus loves even me." },
      { kind: "line", text: "I am so glad that our Father in heaven" },
      { kind: "line", text: "Tells of His love in the Book He has given." },
      { kind: "line", text: "Wonderful things in the Bible I see," },
      { kind: "line", text: "This is the dearest, that Jesus loves me." },
      { kind: "line", text: "If there's only one song I can sing," },
      { kind: "line", text: "When in His beauty I see the great King," },
      { kind: "line", text: "This shall my song in eternity be:" },
      { kind: "line", text: "Oh, what a wonder that Jesus loves me!" },
    ],
  }),
  lyricsOk({
    slug: "away-in-a-manger",
    title: "Away in a Manger",
    group: "gentle",
    tip: "Rock your arms like a manger.",
    blurb: "The little Lord Jesus asleep on the hay.",
    videoId: "h4Jcl_ax2OE",
    ...vevo("Away in a Manger"),
    bookLink: book("the-christmas-story", "Christmas Story"),
    lyricsSource:
      "Anonymous stanzas 1-2, 1885; stanza 3 associated with John T. McFarland. Hymnary: Public Domain. https://hymnary.org/text/away_in_a_manger_no_crib_for_a_bed The Nov 5, 2020 CedarmontKidsVEVO description sings this wording (stay by my side / take us to Heaven).",
    lyrics: [
      { kind: "line", text: "Away in a manger, no crib for a bed," },
      { kind: "line", text: "The little Lord Jesus laid down His sweet head." },
      { kind: "line", text: "The stars in the sky looked down where He lay," },
      { kind: "line", text: "The little Lord Jesus asleep on the hay." },
      { kind: "line", text: "The cattle are lowing, the poor Baby wakes," },
      { kind: "line", text: "But little Lord Jesus, no crying He makes." },
      { kind: "line", text: "I love Thee, Lord Jesus, look down from the sky," },
      { kind: "line", text: "And stay by my side till morning is nigh." },
      { kind: "line", text: "Be near me, Lord Jesus, I ask Thee to stay" },
      { kind: "line", text: "Close by me forever, and love me, I pray." },
      { kind: "line", text: "Bless all the dear children in Thy tender care," },
      { kind: "line", text: "And take us to Heaven to live with Thee there." },
    ],
  }),
  lyricsOk({
    slug: "zacchaeus-was-a-wee-little-man",
    title: "Zacchaeus Was a Wee Little Man",
    group: "story",
    tip: "Climb your hands up high, then call him down from the tree.",
    blurb: "He climbed up in a sycamore tree.",
    videoId: "C8GJXE7e5s0",
    ...vevo("Zacchaeus"),
    bookLink: book("zacchaeus", "Zacchaeus"),
    lyricsSource:
      "First verse only. Hymnals mark stanza 1 Traditional; later stanzas are omitted. https://hymnary.org/text/zacchaeus_was_a_wee_little_man The Oct 17, 2013 CedarmontKidsVEVO video is the official recording of this title. Its page did not reprint the lyric.",
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
  lyricsOk({
    slug: "the-b-i-b-l-e",
    title: "The B-I-B-L-E",
    group: "story",
    tip: "Spell the letters in the air, one for each finger.",
    blurb: "Yes, that's the book for me.",
    videoId: "8a1amee1gW0",
    ...vevo("The B-I-B-L-E"),
    bookLink: allBooksLink,
    lyricsSource:
      "Hymnary.org: anonymous short verse, Public Domain. https://hymnary.org/text/the_b_i_b_l_e_yes_thats_the_book The Mar 11, 2021 CedarmontKidsVEVO description repeats only this verse. A newer Sep 2021 upload adds other verses, so it was not used.",
    lyrics: [
      { kind: "line", text: "The B-I-B-L-E," },
      { kind: "line", text: "Yes, that's the Book for me." },
      { kind: "line", text: "I stand alone on the Word of God," },
      { kind: "line", text: "The B-I-B-L-E." },
    ],
  }),
  lyricsOk({
    slug: "joshua-fought-the-battle-of-jericho",
    title: "Joshua Fought the Battle of Jericho",
    group: "story",
    tip: "March in place, then tumble your hands down.",
    blurb: "And the walls came tumbling down.",
    videoId: "BfJY082DcP8",
    ...listener("Joshua Fought the Battle of Jericho"),
    bookLink: book("joshua-and-jericho", "Joshua and Jericho"),
    lyricsSource:
      "Traditional spiritual, in print by 1882. Hymnary: Public Domain, men of Gideon, and the walls and ram-horn verses. https://hymnary.org/text/you_may_talk_about_the_men_of_gideon The Oct 19, 2023 Listener Kids recording sings these verses.",
    lyrics: [
      { kind: "line", text: "Joshua fought the battle of Jericho, Jericho, Jericho," },
      { kind: "line", text: "Joshua fought the battle of Jericho," },
      { kind: "line", text: "And the walls came tumbling down." },
      { kind: "line", text: "You may talk about the men of Gideon," },
      { kind: "line", text: "You may talk about the men of Saul," },
      { kind: "line", text: "But there's none like good old Joshua" },
      { kind: "line", text: "At the battle of Jericho." },
      { kind: "line", text: "Up to the walls of Jericho, he marched with spear in hand." },
      { kind: "line", text: "“Go blow that ram's horn,” Joshua cried, “for the battle is in my hand.”" },
      { kind: "line", text: "Then the lamb, ram, sheep horns began to blow, and the trumpets began to sound." },
      { kind: "line", text: "Joshua commanded the children to shout, and the walls came tumbling down." },
    ],
  }),
  lyricsOk({
    slug: "little-david-play-on-your-harp",
    title: "Little David, Play on Your Harp",
    group: "story",
    tip: "Strum a little harp, then shout for joy.",
    blurb: "He killed Goliath and shouted for joy.",
    videoId: "3VH0pYbPVUo",
    ...listener("Little David, Play on Your Harp"),
    bookLink: book("david-and-the-giant", "David and the Giant"),
    lyricsSource:
      "Traditional spiritual. Hymnary: Public Domain. https://hymnary.org/text/little_david_was_a_shepherd_boy The Sep 6, 2025 Listener Kids description sings this refrain and the shepherd-boy verse only.",
    lyrics: [
      { kind: "line", text: "Little David, play on your harp, hallelu, hallelu." },
      { kind: "line", text: "Little David, play on your harp, hallelu." },
      { kind: "line", text: "Little David was a shepherd boy," },
      { kind: "line", text: "He killed Goliath and shouted for joy." },
    ],
  }),
  lyricsOk({
    slug: "who-did-swallow-jonah",
    title: "Who Did Swallow Jonah?",
    group: "story",
    tip: "Cup a hand by your ear, then answer whale.",
    blurb: "Who did swallow Jonah down?",
    videoId: "UZ5UeNOXbOQ",
    ...vevo("Who Did Swallow Jonah?"),
    bookLink: book("jonah-and-the-big-fish", "Jonah and the Big Fish"),
    lyricsSource:
      "Traditional spiritual. The Jo-Jo stutter and Daniel verse are the pre-1929 folk text (Barton 1899; ballad index), not the 1986 Beall/Nipp copyright. A Gabriel verse on this recording is left unprinted because its wording was not confirmed as that public-domain text. https://hymnary.org/text/who_did_who_did_who_did_swallow",
    lyrics: [
      { kind: "line", text: "Who did, who did, who did, who did, swallow Jo, Jo, Jo, Jo?" },
      { kind: "line", text: "Whale did, whale did, whale did, whale did, swallow Jo, Jo, Jo, Jo." },
      { kind: "line", text: "Daniel, Daniel, Daniel, Daniel in the lion's den." },
    ],
  }),
  lyricsOk({
    slug: "dare-to-be-a-daniel",
    title: "Dare to Be a Daniel",
    group: "story",
    tip: "Stand tall and brave, like Daniel.",
    blurb: "Dare to stand alone.",
    videoId: "3k7wqHUpJOI",
    ...vevo("Dare To Be A Daniel"),
    bookLink: book("daniel-and-the-lions", "Daniel and the Lions"),
    lyricsSource:
      "P. P. Bliss, 1873. Hymnary: Public Domain. https://hymnary.org/text/standing_by_a_purpose_true The Jan 21, 2021 CedarmontKidsVEVO description sings these verses.",
    lyrics: [
      { kind: "label", text: "Refrain" },
      { kind: "line", text: "Dare to be a Daniel, dare to stand alone," },
      { kind: "line", text: "Dare to have a purpose firm, dare to make it known." },
      { kind: "line", text: "Standing by a purpose true, heeding God's command," },
      { kind: "line", text: "Honor them, the faithful few, all hail to Daniel's band." },
      { kind: "line", text: "Many mighty men are lost, daring not to stand," },
      { kind: "line", text: "Who for God had been a host by joining Daniel's band." },
      { kind: "line", text: "Many giants, great and tall, stalking through the land," },
      { kind: "line", text: "Headlong to the earth would fall if met by Daniel's band." },
      { kind: "line", text: "Hold the Gospel banner high, on to victory grand," },
      { kind: "line", text: "Satan and his hosts defy, and shout for Daniel's band." },
    ],
  }),
];

/** Cue files index the lyrics array, so a "Refrain" label keeps a number. Highlighting uses printed lines only. */
function printedLineIndex(lyrics: LyricPart[], lyricsIndex: number): number | null {
  const part = lyrics[lyricsIndex];
  if (!part || part.kind !== "line") return null;
  let printed = 0;
  for (let index = 0; index < lyricsIndex; index += 1) {
    if (lyrics[index].kind === "line") printed += 1;
  }
  return printed;
}

for (const song of songs) {
  if (song.lyricsStatus !== "lyrics-ok") continue;
  const timing = songCueTimes[song.slug];
  if (!timing || timing.videoId !== song.videoId) {
    throw new Error(`Sing-along cues do not match ${song.slug}`);
  }
  song.videoDuration = timing.videoDuration;
  song.cues = timing.cues.map((cue) => {
    const line = printedLineIndex(song.lyrics, cue.line);
    if (line == null) {
      throw new Error(`Cue for ${song.slug} does not land on a printed line (${cue.line})`);
    }
    return { line, start: cue.start };
  });
}

export const DEFAULT_SONG_SLUG = "this-little-light-of-mine";

export { songForTonight } from "@/lib/tonight-song";

export function songsInGroup(group: SongGroupId) {
  return songs.filter((song) => song.group === group);
}

/** Badge and heading counts. Derived so the lineup can grow without a hard-coded 8/5/4. */
export function groupCount(group: SongGroupId) {
  return songsInGroup(group).length;
}

export function songTotal() {
  return songs.length;
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

export type AskAngelSong = {
  slug: string;
  title: string;
  group: string;
  tip: string;
  page: string;
  bookHref: string;
  bookAnchor: string;
  lyricsOk: boolean;
};

/** Compact song facts for Ask Angel. Built from `songs`, not a hand-copied list. */
export function askAngelSongs(): AskAngelSong[] {
  return songs.map((song) => ({
    slug: song.slug,
    title: song.title,
    group: SONG_GROUPS.find((group) => group.id === song.group)?.title ?? song.group,
    tip: song.tip,
    page: `/songs?song=${song.slug}`,
    bookHref: song.bookLink?.href ?? "",
    bookAnchor: song.bookLink?.anchor ?? "",
    lyricsOk: song.lyricsStatus === "lyrics-ok",
  }));
}

export function formatSongKnowledge(): string {
  const lines = askAngelSongs().map((song) => {
    const book = song.bookHref ? ` Book link: ${song.bookAnchor} (${song.bookHref}).` : "";
    const words = song.lyricsOk
      ? " The printed words are traditional and in the public domain."
      : " Do not call the words public domain. Say to sing along with the video.";
    return `- ${song.title} (${song.group}). Open ${song.page}.${book} Motion: ${song.tip}${words}`;
  });
  return [
    "SONGS:",
    "- Sing-along page: /songs. The top menu is Home, Tonight, Songs, Play, Free, Churches, Shop. About is not in the top menu. About is a footer link, and the page is still /about.",
    "- Tonight's song: on /tonight, under the story. Zacchaeus night links to the Zacchaeus song, Joshua and Jericho night to Joshua Fought the Battle of Jericho, David and the Giant night to Little David, Jonah and the Big Fish night to Who Did Swallow Jonah?, Daniel and the Lions night to Dare to Be a Daniel, and the Christmas Story night to Away in a Manger. Noah and every other night use This Little Light of Mine.",
    ...lines,
  ].join("\n");
}

/** Local answers from the song list. Returns null when the question is not about songs or About. */
export function answerFromSongs(question: string): string | null {
  const q = question.toLowerCase();
  const about = /\babout\b|who is faith|faith rivers/.test(q);
  const songsAsked = /song|sing|music|hymn/.test(q);
  if (!about && !songsAsked) return null;

  if (about && !songsAsked) {
    return "About is in the footer, not the top menu. The page is still /about. It introduces Faith Rivers and the heart behind the series.";
  }

  const catalog = askAngelSongs();
  const byBook = catalog.find((song) => {
    const hay = `${song.bookAnchor} ${song.bookHref} ${song.title}`.toLowerCase();
    return ["jonah", "joshua", "jericho", "david", "goliath", "daniel", "zacchaeus", "christmas", "manger"].some(
      (word) => q.includes(word) && hay.includes(word),
    );
  });
  if (byBook) {
    const book = byBook.bookHref ? ` ${byBook.bookAnchor}: ${byBook.bookHref}.` : "";
    const domain = byBook.lyricsOk ? " The printed words are in the public domain." : "";
    return `${byBook.title} is the song for that story. Open ${byBook.page}.${book}${domain}`;
  }

  if (/tonight/.test(q)) {
    return "Tonight's song is on /tonight under the story. Noah and nights without a matching story song use This Little Light of Mine: /songs?song=this-little-light-of-mine.";
  }

  const group = /gentle|quiet|bedtime|lullaby/.test(q)
    ? "Gentle Songs"
    : /story|bible story/.test(q)
      ? "Bible Story Songs"
      : /action|wiggle|clap/.test(q)
        ? "Action Songs"
        : "";
  if (group) {
    const pick = catalog.find((song) => song.group === group);
    if (pick) {
      return `A ${group.replace(" Songs", "").toLowerCase()} song is ${pick.title}. Open ${pick.page}. The whole list is on /songs.`;
    }
  }

  return "The sing-along songs are on /songs. Tell me a story, a mood, or a book and I can point you to one song.";
}
