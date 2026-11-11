// Timings for the exact video on each song.
// `line` is the index in that song's lyrics array, including labels.
// lib/songs.ts maps it to the printed line index. Labels are never cued.
// Starts are faster-whisper word times from `python scripts/align-songs.py`.
// data/song-alignment.json is that script's per-line score for the same video.
export const songCueTimes: Record<string, { videoId: string; videoDuration: number; cues: { line: number; start: number }[] }> = {
  "this-little-light-of-mine": {
    videoId: "Xe_1XJsjMZY",
    videoDuration: 101,
    cues: [{ line: 0, start: 10.24 }, { line: 1, start: 30.52 }, { line: 2, start: 49.94 }, { line: 3, start: 54.02 }, { line: 4, start: 58.58 }, { line: 5, start: 62.76 }, { line: 6, start: 69.7 }, { line: 7, start: 73.88 }],
  },
  "ive-got-the-joy": {
    videoId: "8i_IoI9NmW8",
    videoDuration: 151,
    cues: [{ line: 0, start: 8.62 }, { line: 1, start: 14.1 }, { line: 2, start: 18.04 }, { line: 3, start: 22.56 }, { line: 5, start: 26.16 }, { line: 6, start: 29.6 }, { line: 5, start: 34.0 }, { line: 6, start: 37.86 }, { line: 7, start: 42.36 }, { line: 8, start: 47.04 }, { line: 9, start: 50.96 }, { line: 10, start: 55.16 }, { line: 5, start: 58.3 }, { line: 6, start: 62.68 }, { line: 5, start: 67.1 }, { line: 6, start: 71.02 }, { line: 11, start: 75.46 }, { line: 6, start: 95.78 }, { line: 5, start: 100.52 }, { line: 6, start: 104.02 }, { line: 5, start: 125.12 }, { line: 6, start: 129.58 }, { line: 5, start: 133.32 }, { line: 6, start: 137.84 }, { line: 6, start: 141.5 }, { line: 6, start: 146.24 }],
  },
  "hallelujah-praise-ye-the-lord": {
    videoId: "G1VrEJ5lsnQ",
    videoDuration: 110,
    cues: [{ line: 0, start: 15.06 }, { line: 1, start: 35.53 }, { line: 2, start: 45.24 }, { line: 3, start: 45.9 }, { line: 4, start: 46.58 }, { line: 5, start: 47.22 }, { line: 2, start: 47.62 }, { line: 3, start: 48.32 }, { line: 4, start: 49.12 }, { line: 2, start: 50.44 }, { line: 3, start: 51.68 }, { line: 4, start: 53.34 }, { line: 5, start: 91.02 }],
  },
  "jesus-wants-me-for-a-sunbeam": {
    videoId: "UYWWBnAepes",
    videoDuration: 150,
    cues: [{ line: 0, start: 9.08 }, { line: 1, start: 17.48 }, { line: 3, start: 27.16 }, { line: 4, start: 36.28 }, { line: 5, start: 53.84 }, { line: 6, start: 62.3 }, { line: 3, start: 72.64 }, { line: 4, start: 81.36 }, { line: 7, start: 98.86 }, { line: 8, start: 107.16 }, { line: 3, start: 116.12 }, { line: 4, start: 126.26 }],
  },
  "do-lord": {
    videoId: "FCXvjx-nP9g",
    videoDuration: 152,
    cues: [{ line: 0, start: 7.2 }, { line: 1, start: 12.49 }, { line: 2, start: 17.21 }, { line: 3, start: 21.04 }, { line: 4, start: 26.12 }, { line: 5, start: 30.98 }, { line: 6, start: 35.76 }, { line: 7, start: 39.48 }, { line: 11, start: 51.72 }, { line: 3, start: 61.44 }, { line: 8, start: 65.8 }, { line: 9, start: 71.38 }, { line: 10, start: 76.28 }, { line: 7, start: 79.76 }, { line: 0, start: 91.58 }, { line: 1, start: 97.43 }, { line: 11, start: 101.4 }, { line: 3, start: 121.84 }, { line: 2, start: 127.16 }, { line: 7, start: 140.82 }],
  },
  "ive-got-peace-like-a-river": {
    videoId: "A9xOG-v0LzU",
    videoDuration: 98,
    cues: [{ line: 0, start: 11.24 }, { line: 1, start: 16.2 }, { line: 0, start: 20.82 }, { line: 1, start: 25.8 }, { line: 2, start: 30.52 }, { line: 3, start: 35.44 }, { line: 2, start: 40.24 }, { line: 3, start: 45.26 }, { line: 4, start: 50.29 }, { line: 5, start: 55.13 }, { line: 4, start: 59.55 }, { line: 5, start: 64.71 }, { line: 6, start: 83.68 }],
  },
  "wide-wide-as-the-ocean": {
    videoId: "Ri-StyOL1I4",
    videoDuration: 106,
    cues: [{ line: 0, start: 10.28 }, { line: 1, start: 17.26 }, { line: 2, start: 23.56 }, { line: 3, start: 31.32 }, { line: 0, start: 39.48 }, { line: 1, start: 47.62 }, { line: 2, start: 54.88 }, { line: 3, start: 62.02 }, { line: 0, start: 69.86 }, { line: 1, start: 78.04 }, { line: 2, start: 85.04 }, { line: 3, start: 91.28 }],
  },
  "jesus-loves-me": {
    videoId: "QSaWPYb6_6k",
    videoDuration: 125,
    cues: [{ line: 0, start: 15.5 }, { line: 1, start: 20.56 }, { line: 2, start: 26.02 }, { line: 3, start: 29.54 }, { line: 5, start: 36.3 }, { line: 6, start: 40.82 }, { line: 7, start: 45.68 }, { line: 8, start: 50.12 }, { line: 9, start: 58.24 }, { line: 10, start: 63.94 }, { line: 11, start: 68.76 }, { line: 12, start: 73.4 }, { line: 5, start: 77.88 }, { line: 6, start: 83.44 }, { line: 7, start: 88.6 }, { line: 8, start: 93.72 }, { line: 5, start: 98.4 }, { line: 6, start: 102.98 }, { line: 7, start: 108.26 }, { line: 8, start: 113.14 }, { line: 8, start: 118.1 }],
  },
  "hes-got-the-whole-world": {
    videoId: "b4uNT8a4Q1s",
    videoDuration: 118,
    cues: [{ line: 0, start: 8.0 }, { line: 5, start: 12.5 }, { line: 0, start: 16.46 }, { line: 1, start: 24.68 }, { line: 1, start: 28.42 }, { line: 1, start: 32.64 }, { line: 5, start: 36.62 }, { line: 2, start: 44.3 }, { line: 2, start: 48.26 }, { line: 5, start: 52.3 }, { line: 3, start: 55.62 }, { line: 3, start: 60.22 }, { line: 0, start: 68.38 }, { line: 4, start: 71.62 }, { line: 4, start: 76.3 }, { line: 5, start: 80.26 }, { line: 0, start: 88.52 }, { line: 5, start: 117.24 }],
  },
  "praise-him-praise-him": {
    videoId: "Srbmk3zrsss",
    videoDuration: 116,
    cues: [{ line: 0, start: 8.54 }, { line: 1, start: 13.14 }, { line: 0, start: 17.4 }, { line: 3, start: 21.96 }, { line: 2, start: 30.08 }, { line: 5, start: 34.72 }, { line: 2, start: 38.86 }, { line: 1, start: 43.16 }, { line: 0, start: 51.54 }, { line: 3, start: 55.88 }, { line: 0, start: 60.22 }, { line: 5, start: 64.7 }, { line: 4, start: 72.84 }, { line: 1, start: 88.24 }, { line: 3, start: 92.36 }],
  },
  "jesus-loves-even-me": {
    videoId: "DnJ65AKkRaE",
    videoDuration: 108,
    cues: [{ line: 1, start: 9.24 }, { line: 2, start: 13.36 }, { line: 2, start: 15.62 }, { line: 3, start: 17.58 }, { line: 4, start: 21.56 }, { line: 5, start: 26.94 }, { line: 6, start: 30.76 }, { line: 7, start: 35.2 }, { line: 8, start: 38.96 }, { line: 1, start: 42.28 }, { line: 2, start: 46.38 }, { line: 2, start: 48.42 }, { line: 3, start: 50.6 }, { line: 4, start: 54.56 }, { line: 9, start: 60.9 }, { line: 10, start: 64.26 }, { line: 11, start: 67.5 }, { line: 12, start: 71.96 }, { line: 1, start: 75.86 }, { line: 2, start: 79.72 }, { line: 2, start: 81.64 }, { line: 3, start: 83.68 }, { line: 4, start: 87.54 }],
  },
  "away-in-a-manger": {
    videoId: "h4Jcl_ax2OE",
    videoDuration: 140,
    cues: [{ line: 0, start: 7.96 }, { line: 1, start: 15.74 }, { line: 2, start: 24.44 }, { line: 3, start: 32.34 }, { line: 4, start: 45.91 }, { line: 5, start: 54.18 }, { line: 6, start: 61.0 }, { line: 7, start: 68.88 }, { line: 8, start: 79.28 }, { line: 9, start: 90.38 }, { line: 10, start: 98.0 }, { line: 11, start: 106.02 }, { line: 11, start: 114.68 }],
  },
  "zacchaeus-was-a-wee-little-man": {
    videoId: "C8GJXE7e5s0",
    videoDuration: 62,
    cues: [{ line: 0, start: 13.18 }, { line: 1, start: 16.44 }, { line: 2, start: 18.58 }, { line: 3, start: 22.46 }, { line: 4, start: 25.0 }, { line: 5, start: 28.82 }, { line: 6, start: 32.04 }, { line: 7, start: 36.66 }, { line: 7, start: 39.62 }],
  },
  "the-b-i-b-l-e": {
    videoId: "8a1amee1gW0",
    videoDuration: 93,
    cues: [{ line: 0, start: 18.44 }, { line: 1, start: 20.88 }, { line: 2, start: 22.72 }, { line: 3, start: 25.52 }, { line: 0, start: 26.98 }, { line: 1, start: 29.18 }, { line: 2, start: 31.42 }, { line: 3, start: 34.3 }, { line: 0, start: 35.72 }, { line: 1, start: 38.02 }, { line: 2, start: 40.18 }, { line: 3, start: 43.06 }, { line: 0, start: 55.52 }, { line: 1, start: 58.1 }, { line: 2, start: 59.76 }, { line: 3, start: 62.58 }, { line: 0, start: 64.12 }, { line: 1, start: 66.34 }, { line: 2, start: 68.46 }, { line: 3, start: 71.36 }, { line: 0, start: 72.8 }],
  },
  "joshua-fought-the-battle-of-jericho": {
    videoId: "BfJY082DcP8",
    videoDuration: 123,
    cues: [{ line: 0, start: 10.64 }, { line: 1, start: 15.87 }, { line: 2, start: 18.25 }, { line: 0, start: 21.09 }, { line: 6, start: 26.86 }, { line: 3, start: 30.52 }, { line: 4, start: 33.4 }, { line: 5, start: 35.9 }, { line: 6, start: 38.38 }, { line: 0, start: 41.56 }, { line: 1, start: 46.6 }, { line: 2, start: 49.16 }, { line: 7, start: 52.22 }, { line: 8, start: 56.66 }, { line: 0, start: 62.46 }, { line: 1, start: 67.44 }, { line: 2, start: 70.08 }, { line: 9, start: 72.76 }, { line: 10, start: 78.28 }, { line: 0, start: 83.26 }, { line: 1, start: 88.36 }, { line: 2, start: 90.9 }, { line: 0, start: 104.1 }, { line: 1, start: 109.24 }, { line: 2, start: 111.68 }],
  },
  "little-david-play-on-your-harp": {
    videoId: "3VH0pYbPVUo",
    videoDuration: 127,
    cues: [{ line: 1, start: 9.08 }, { line: 1, start: 13.38 }, { line: 1, start: 18.06 }, { line: 1, start: 22.44 }, { line: 2, start: 26.72 }, { line: 3, start: 31.74 }, { line: 1, start: 36.38 }, { line: 1, start: 40.32 }, { line: 0, start: 44.62 }, { line: 1, start: 49.38 }, { line: 2, start: 53.46 }, { line: 3, start: 58.5 }, { line: 2, start: 80.02 }],
  },
  "who-did-swallow-jonah": {
    videoId: "UZ5UeNOXbOQ",
    videoDuration: 124,
    cues: [{ line: 0, start: 12.86 }, { line: 0, start: 17.1 }, { line: 0, start: 22.14 }, { line: 1, start: 38.52 }, { line: 2, start: 92.69 }, { line: 2, start: 97.36 }, { line: 2, start: 102.72 }],
  },
  "dare-to-be-a-daniel": {
    videoId: "3k7wqHUpJOI",
    videoDuration: 95,
    cues: [{ line: 1, start: 8.76 }, { line: 2, start: 13.04 }, { line: 3, start: 17.52 }, { line: 4, start: 21.64 }, { line: 1, start: 26.18 }, { line: 2, start: 31.18 }, { line: 5, start: 34.98 }, { line: 6, start: 39.52 }, { line: 1, start: 43.7 }, { line: 2, start: 48.12 }, { line: 7, start: 52.68 }, { line: 8, start: 57.06 }, { line: 1, start: 61.22 }, { line: 2, start: 65.56 }, { line: 9, start: 68.04 }, { line: 10, start: 74.52 }, { line: 1, start: 78.74 }, { line: 2, start: 83.08 }],
  },
};
