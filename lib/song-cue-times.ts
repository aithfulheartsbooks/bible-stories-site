// Timings for the exact video on each song.
// `line` is the index in that song's lyrics array, including labels.
// lib/songs.ts maps it to the printed line index. Labels are never cued.
export const songCueTimes: Record<string, { videoId: string; videoDuration: number; cues: { line: number; start: number }[] }> = {
  "this-little-light-of-mine": {
    videoId: "Xe_1XJsjMZY",
    videoDuration: 102,
    cues: [{ line: 0, start: 10.67 }, { line: 1, start: 15.05 }, { line: 2, start: 19.47 }, { line: 3, start: 23.5 }, { line: 4, start: 30.46 }, { line: 5, start: 39.26 }, { line: 6, start: 43.3 }, { line: 7, start: 51.64 }, { line: 8, start: 63.19 }, { line: 9, start: 79.95 }, { line: 10, start: 81.89 }, { line: 11, start: 83.53 }, { line: 12, start: 87.09 }, { line: 13, start: 89.28 }, { line: 14, start: 93.66 }, { line: 15, start: 97.81 }],
  },
  "ive-got-the-joy": {
    videoId: "8i_IoI9NmW8",
    videoDuration: 152,
    cues: [{ line: 0, start: 9.43 }, { line: 1, start: 14.52 }, { line: 2, start: 18.1 }, { line: 3, start: 28.25 }, { line: 5, start: 34.51 }, { line: 6, start: 37.92 }, { line: 7, start: 42.92 }, { line: 8, start: 48.32 }, { line: 9, start: 56.25 }, { line: 10, start: 67.53 }, { line: 11, start: 68.93 }, { line: 12, start: 78.14 }, { line: 13, start: 89.08 }, { line: 14, start: 98.54 }, { line: 0, start: 109.09 }, { line: 1, start: 118.08 }, { line: 2, start: 119.9 }, { line: 3, start: 126.81 }, { line: 5, start: 134.02 }, { line: 6, start: 137.18 }, { line: 7, start: 141.65 }, { line: 8, start: 147.46 }],
  },
  "hallelujah-praise-ye-the-lord": {
    videoId: "G1VrEJ5lsnQ",
    videoDuration: 110,
    cues: [{ line: 0, start: 11.53 }, { line: 1, start: 17.24 }, { line: 2, start: 23.43 }, { line: 3, start: 27.11 }, { line: 4, start: 32.58 }, { line: 5, start: 39.8 }, { line: 0, start: 47.59 }, { line: 1, start: 51.55 }, { line: 2, start: 57.78 }, { line: 3, start: 60.35 }, { line: 4, start: 63.23 }, { line: 5, start: 67.68 }, { line: 0, start: 72.79 }, { line: 1, start: 82.08 }, { line: 2, start: 91.68 }, { line: 3, start: 94.48 }, { line: 4, start: 98.93 }, { line: 5, start: 106.3 }],
  },
  "jesus-wants-me-for-a-sunbeam": {
    videoId: "UYWWBnAepes",
    videoDuration: 151,
    cues: [{ line: 0, start: 9.74 }, { line: 1, start: 18.9 }, { line: 3, start: 27.53 }, { line: 4, start: 38.75 }, { line: 5, start: 54.79 }, { line: 6, start: 63.78 }],
  },
  "do-lord": {
    videoId: "FCXvjx-nP9g",
    videoDuration: 152,
    cues: [{ line: 0, start: 8.63 }, { line: 1, start: 12.43 }, { line: 2, start: 21.29 }, { line: 3, start: 27.77 }, { line: 4, start: 36.04 }, { line: 5, start: 39.76 }, { line: 6, start: 43.44 }, { line: 7, start: 58.59 }, { line: 8, start: 65.57 }, { line: 9, start: 71.41 }, { line: 10, start: 76.11 }, { line: 11, start: 80.05 }, { line: 0, start: 88.56 }, { line: 1, start: 92.38 }, { line: 2, start: 97.1 }, { line: 3, start: 101.24 }, { line: 4, start: 106.76 }, { line: 5, start: 111.45 }, { line: 6, start: 116.17 }, { line: 7, start: 120.11 }, { line: 8, start: 127.79 }, { line: 9, start: 131.32 }, { line: 10, start: 137.91 }, { line: 11, start: 141.21 }],
  },
  "ive-got-peace-like-a-river": {
    videoId: "A9xOG-v0LzU",
    videoDuration: 99,
    cues: [{ line: 0, start: 12.33 }, { line: 1, start: 21.45 }, { line: 2, start: 27.6 }, { line: 3, start: 38.18 }, { line: 4, start: 47.82 }, { line: 5, start: 57.45 }, { line: 6, start: 63.08 }, { line: 0, start: 71.0 }, { line: 1, start: 75.66 }, { line: 2, start: 79.01 }, { line: 3, start: 80.91 }, { line: 4, start: 84.55 }, { line: 5, start: 86.35 }, { line: 6, start: 95.07 }],
  },
  "wide-wide-as-the-ocean": {
    videoId: "Ri-StyOL1I4",
    videoDuration: 106,
    cues: [{ line: 0, start: 10.27 }, { line: 1, start: 17.39 }, { line: 2, start: 25.38 }, { line: 3, start: 31.68 }, { line: 0, start: 40.67 }, { line: 1, start: 47.79 }, { line: 2, start: 55.76 }, { line: 3, start: 62.14 }, { line: 0, start: 71.07 }, { line: 1, start: 78.17 }, { line: 2, start: 86.2 }, { line: 3, start: 92.54 }],
  },
  "jesus-loves-me": {
    videoId: "f1JbSvhw43I",
    videoDuration: 189,
    cues: [{ line: 0, start: 11.57 }, { line: 1, start: 17.96 }, { line: 2, start: 23.26 }, { line: 3, start: 25.35 }, { line: 5, start: 30.97 }, { line: 6, start: 33.92 }, { line: 7, start: 38.64 }, { line: 8, start: 42.27 }, { line: 9, start: 46.59 }, { line: 10, start: 54.02 }, { line: 11, start: 57.25 }, { line: 12, start: 59.15 }, { line: 0, start: 67.28 }, { line: 1, start: 73.71 }, { line: 2, start: 77.69 }, { line: 3, start: 79.19 }, { line: 5, start: 83.47 }, { line: 6, start: 84.72 }, { line: 7, start: 87.74 }, { line: 8, start: 89.52 }, { line: 9, start: 94.62 }, { line: 10, start: 97.01 }, { line: 11, start: 98.95 }, { line: 12, start: 105.06 }, { line: 0, start: 108.66 }, { line: 1, start: 113.43 }, { line: 2, start: 116.19 }, { line: 3, start: 121.75 }, { line: 5, start: 127.86 }, { line: 6, start: 133.19 }, { line: 7, start: 134.41 }, { line: 8, start: 137.29 }, { line: 9, start: 140.5 }, { line: 10, start: 143.72 }, { line: 11, start: 150.07 }, { line: 12, start: 154.92 }, { line: 0, start: 160.2 }, { line: 1, start: 165.91 }, { line: 2, start: 168.39 }, { line: 3, start: 170.63 }, { line: 5, start: 174.7 }, { line: 6, start: 176.66 }, { line: 7, start: 178.27 }, { line: 8, start: 182.02 }],
  },
  "hes-got-the-whole-world": {
    videoId: "b4uNT8a4Q1s",
    videoDuration: 119,
    cues: [{ line: 0, start: 8.47 }, { line: 1, start: 12.44 }, { line: 2, start: 16.74 }, { line: 3, start: 21.11 }, { line: 4, start: 25.82 }, { line: 5, start: 32.43 }, { line: 0, start: 40.52 }, { line: 1, start: 44.44 }, { line: 2, start: 48.69 }, { line: 3, start: 52.41 }, { line: 4, start: 56.5 }, { line: 5, start: 64.43 }, { line: 0, start: 75.45 }, { line: 1, start: 78.11 }, { line: 2, start: 81.12 }, { line: 3, start: 84.38 }, { line: 4, start: 88.13 }, { line: 5, start: 92.89 }],
  },
  "praise-him-praise-him": {
    videoId: "Srbmk3zrsss",
    videoDuration: 116,
    cues: [{ line: 0, start: 8.99 }, { line: 1, start: 13.28 }, { line: 2, start: 17.86 }, { line: 3, start: 21.85 }, { line: 4, start: 30.02 }, { line: 5, start: 34.73 }, { line: 0, start: 39.74 }, { line: 1, start: 43.28 }, { line: 2, start: 48.79 }, { line: 3, start: 56.14 }, { line: 4, start: 63.8 }, { line: 5, start: 69.57 }, { line: 0, start: 75.64 }, { line: 1, start: 85.53 }, { line: 2, start: 95.75 }, { line: 3, start: 98.24 }],
  },
  "jesus-loves-even-me": {
    videoId: "DnJ65AKkRaE",
    videoDuration: 108,
    cues: [{ line: 1, start: 12.02 }, { line: 2, start: 16.63 }, { line: 3, start: 18.07 }, { line: 4, start: 21.59 }, { line: 5, start: 27.76 }, { line: 6, start: 31.32 }, { line: 7, start: 35.2 }, { line: 8, start: 39.09 }, { line: 9, start: 43.29 }, { line: 10, start: 49.43 }, { line: 11, start: 53.29 }, { line: 12, start: 61.54 }, { line: 1, start: 68.3 }, { line: 2, start: 73.06 }, { line: 3, start: 75.23 }, { line: 4, start: 81.82 }, { line: 5, start: 87.7 }, { line: 6, start: 89.42 }, { line: 7, start: 93.17 }, { line: 8, start: 96.29 }],
  },
  "away-in-a-manger": {
    videoId: "h4Jcl_ax2OE",
    videoDuration: 140,
    cues: [{ line: 0, start: 8.87 }, { line: 1, start: 16.74 }, { line: 2, start: 24.52 }, { line: 3, start: 31.75 }, { line: 4, start: 45.88 }, { line: 5, start: 53.76 }, { line: 6, start: 60.81 }, { line: 7, start: 62.41 }, { line: 8, start: 69.75 }, { line: 9, start: 73.93 }, { line: 10, start: 78.45 }, { line: 11, start: 87.22 }, { line: 0, start: 92.24 }, { line: 1, start: 98.18 }, { line: 2, start: 105.31 }, { line: 3, start: 112.44 }],
  },
  "zacchaeus-was-a-wee-little-man": {
    videoId: "C8GJXE7e5s0",
    videoDuration: 62,
    cues: [{ line: 0, start: 13.13 }, { line: 1, start: 16.37 }, { line: 2, start: 19.51 }, { line: 3, start: 22.6 }, { line: 4, start: 25.88 }, { line: 5, start: 28.96 }, { line: 6, start: 32.16 }, { line: 7, start: 36.84 }, { line: 0, start: 40.19 }, { line: 1, start: 44.45 }, { line: 2, start: 46.45 }, { line: 3, start: 48.64 }, { line: 4, start: 50.9 }, { line: 6, start: 53.9 }],
  },
  "the-b-i-b-l-e": {
    videoId: "8a1amee1gW0",
    videoDuration: 94,
    cues: [{ line: 0, start: 25.62 }, { line: 1, start: 28.61 }, { line: 2, start: 31.95 }, { line: 3, start: 34.19 }, { line: 0, start: 55.85 }, { line: 1, start: 58.11 }, { line: 2, start: 59.55 }, { line: 3, start: 62.55 }, { line: 1, start: 66.8 }, { line: 2, start: 68.26 }, { line: 3, start: 71.28 }, { line: 0, start: 77.92 }, { line: 1, start: 84.23 }, { line: 2, start: 86.47 }, { line: 3, start: 88.76 }],
  },
  "joshua-fought-the-battle-of-jericho": {
    videoId: "BfJY082DcP8",
    videoDuration: 123,
    cues: [{ line: 0, start: 10.56 }, { line: 1, start: 14.8 }, { line: 2, start: 18.32 }, { line: 3, start: 31.76 }, { line: 4, start: 34.36 }, { line: 5, start: 37.0 }, { line: 6, start: 40.88 }, { line: 0, start: 44.88 }, { line: 1, start: 62.76 }, { line: 2, start: 70.32 }, { line: 6, start: 84.24 }, { line: 0, start: 89.16 }, { line: 1, start: 103.52 }, { line: 2, start: 111.12 }],
  },
  "little-david-play-on-your-harp": {
    videoId: "3VH0pYbPVUo",
    videoDuration: 127,
    cues: [{ line: 0, start: 9.84 }, { line: 1, start: 18.4 }, { line: 2, start: 27.28 }, { line: 3, start: 32.08 }, { line: 0, start: 36.64 }, { line: 1, start: 40.0 }, { line: 2, start: 54.16 }, { line: 3, start: 58.88 }],
  },
  "who-did-swallow-jonah": {
    videoId: "UZ5UeNOXbOQ",
    videoDuration: 125,
    cues: [{ line: 0, start: 11.72 }, { line: 1, start: 19.75 }, { line: 2, start: 25.07 }, { line: 3, start: 30.69 }, { line: 0, start: 38.5 }, { line: 1, start: 45.88 }, { line: 2, start: 55.21 }, { line: 3, start: 57.43 }, { line: 0, start: 73.56 }, { line: 1, start: 78.27 }, { line: 2, start: 81.05 }, { line: 3, start: 87.85 }, { line: 0, start: 92.85 }, { line: 1, start: 94.68 }, { line: 2, start: 102.0 }, { line: 3, start: 105.38 }, { line: 0, start: 109.07 }, { line: 1, start: 111.09 }, { line: 2, start: 113.23 }, { line: 3, start: 115.42 }],
  },
  "dare-to-be-a-daniel": {
    videoId: "3k7wqHUpJOI",
    videoDuration: 95,
    cues: [{ line: 1, start: 9.48 }, { line: 2, start: 13.82 }, { line: 3, start: 18.16 }, { line: 4, start: 22.62 }, { line: 5, start: 35.73 }, { line: 6, start: 40.09 }, { line: 7, start: 47.75 }, { line: 8, start: 57.57 }, { line: 9, start: 62.42 }, { line: 10, start: 75.08 }],
  },
};
