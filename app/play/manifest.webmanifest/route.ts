export function GET() {
  return Response.json({
    name: "Play Corner - Bible Stories for Little Hearts",
    short_name: "Play Corner",
    description: "Daily Bible story puzzles for kids from Bible Stories for Little Hearts.",
    start_url: "/play",
    scope: "/play",
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
  });
}
