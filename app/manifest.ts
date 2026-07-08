import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bible Stories for Little Hearts",
    short_name: "Little Hearts",
    description: "Warm, gentle Bible story picture books for children ages 3 to 8.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#FAF3E0",
    theme_color: "#C1623F",
    icons: [
      {
        src: "/icons/rainbow-favicon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
