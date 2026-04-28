/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#fdf6e9",
        "cream-deep": "#f7ead0",
        peach: "#ffd5b8",
        "pink-soft": "#ffc8d4",
        lavender: "#d8c8ee",
        sky: "#cbe2f2",
        sage: "#c8dcb8",
        gold: "#e8a854",
        terracotta: "#d97757",
        chestnut: "#5a3d2b",
        "chestnut-soft": "#7a5640",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-quicksand)", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.9s ease-out forwards",
        bob: "bob 2s ease-in-out infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
        "drift-slow": "drift 80s linear infinite",
        "drift-medium": "drift 95s linear infinite",
        "drift-long": "drift 110s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.1)" },
        },
        drift: {
          from: { transform: "translateX(-200px)" },
          to: { transform: "translateX(calc(100vw + 250px))" },
        },
      },
    },
  },
  plugins: [],
};
