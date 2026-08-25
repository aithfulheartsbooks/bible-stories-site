export type PeekPage = {
  kicker: string;
  text: string;
};

export const PEEKS: Record<string, PeekPage[]> = {
  "noah-and-gods-big-promise": [
    {
      kicker: "Noah loved God",
      text: "A long, long time ago, there lived a man named Noah. Noah loved God with all his heart. One day God said, \u201cI need you to do something big. Build a very, very big boat.\u201d Noah looked around. There was no water nearby. But Noah trusted God.",
    },
    {
      kicker: "Two by two",
      text: "When the Ark was ready, God said, \u201cNow bring the animals, Noah.\u201d Two by two they came. Big ones and small ones. Tall ones and fluffy ones. Noah welcomed them all. \u201cCome in, come in,\u201d he said with a smile.",
    },
    {
      kicker: "The rain",
      text: "Then the rain began. First a little. Then a lot. The water rose higher and higher. But inside the Ark, everyone was safe and warm. For many days it rained. But Noah was not afraid. He trusted God's promise.",
    },
    {
      kicker: "A rainbow",
      text: "Noah looked up at the sky. And there it was \u2014 a beautiful rainbow. God spoke again. \u201cNoah, this rainbow is my promise. I will care for the world I made.\u201d When you see a rainbow, remember \u2014 God keeps His promises.",
    },
  ],
};

export function peekFor(slug: string, blurb?: string): PeekPage[] | undefined {
  if (PEEKS[slug]) return PEEKS[slug];
  if (!blurb) return undefined;
  return [
    { kicker: "From the story", text: blurb },
    {
      kicker: "Read together",
      text: "This picture book is for little hearts ages 3\u20138. Turn the pages slowly. Ask what they notice in the pictures.",
    },
    {
      kicker: "Talk about it",
      text: "After you read, ask: what did we learn about God in this story?",
    },
    {
      kicker: "The whole book",
      text: "These few pages are only a peek. The printed book has the pictures and the rest of the story.",
    },
  ];
}
