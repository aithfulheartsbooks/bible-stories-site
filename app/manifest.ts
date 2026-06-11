import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Play Corner - Bible Stories for Little Hearts",
    short_name: "Play Corner",
    description: "Daily Bible story puzzles for kids from Bible Stories for Little Hearts.",
    start_url: "/play",
    scope: "/",
    display: "standalone",
    background_color: "#FAF3E0",
    theme_color: "#C1623F",
    icons: [
      {
        src: "/icons/play-corner-192-v2.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/play-corner-512-v2.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/play-corner-maskable-512-v2.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
