# 📚 Bible Stories for Little Hearts

A warm, watercolor-themed website showcasing your Christian children's book series, built with Next.js 14, Tailwind CSS, and TypeScript. Designed to deploy free on Vercel.

---

## 🚀 Deploying to Vercel (the easy way)

### Option A: Drag & drop (no Git needed, fastest)

1. Sign up free at [vercel.com](https://vercel.com)
2. Run `npm install` then `npm run build` locally to make sure everything works
3. Drag this entire folder onto your Vercel dashboard — it will deploy automatically
4. You'll get a free URL like `bible-stories-for-little-hearts.vercel.app`

### Option B: GitHub + Vercel (recommended for ongoing updates)

1. Create a free GitHub account at [github.com](https://github.com)
2. Create a new repository and upload this folder
3. Sign up at [vercel.com](https://vercel.com) and click "Import Project"
4. Connect your GitHub repo — Vercel detects Next.js automatically
5. Click **Deploy**. Done.
6. From now on, any change you push to GitHub auto-deploys to your live site.

### Custom domain (optional)

Once deployed on Vercel, you can connect a custom domain (like `biblestoriesforlittlehearts.com`) in the Vercel dashboard under Settings → Domains. Vercel walks you through it.

---

## 💻 Running locally

You'll need [Node.js](https://nodejs.org) (version 18 or newer) installed.

```bash
npm install        # install dependencies (first time only)
npm run dev        # start the dev server at http://localhost:3000
```

---

## 📖 Adding a new book

Open `app/books.ts` and add a new entry to the `books` array. To add Book 4 (Jonah, for example):

```ts
{
  number: "Book 04",
  title: "Jonah and the Big Fish",
  subtitle: "A Story of Second Chances",
  ageRange: "Ages 4–8",
  theme: "Forgiveness",
  blurb: "Your blurb text here...",
  amazonUrl: "https://www.amazon.com/your-product-link",
  status: "available",
  coverScene: "default",  // or add a new scene (see below)
}
```

Then **delete one of the "Coming Soon" entries** to keep the grid balanced.

### Adding a custom cover illustration for a new book

1. Open `components/BookCovers.tsx`
2. Copy one of the existing components (like `MosesCover`) and rename it (e.g., `JonahCover`)
3. Update the SVG shapes to match your new story
4. Add it to the `coverMap` at the bottom of the file:
   ```ts
   export const coverMap = {
     noah: NoahCover,
     david: DavidCover,
     moses: MosesCover,
     jonah: JonahCover,   // ← add this
     default: DefaultCover,
   };
   ```
5. Update the `Book` type in `app/books.ts` to include `"jonah"` as a valid `coverScene`

---

## ⚠️ Before publishing

Replace the placeholder Amazon URLs in `app/books.ts`. Look for the lines marked:

```ts
amazonUrl: "https://www.amazon.com/", // ← replace with your real Amazon link
```

Paste your actual Amazon product URL for each book.

---

## 🎨 Customizing the look

- **Colors:** edit the `colors` block in `tailwind.config.js`
- **Fonts:** edit `app/layout.tsx` (uses Google Fonts via Next.js — currently Fraunces + Quicksand)
- **Hero text:** edit `app/page.tsx`
- **Footer text:** edit `app/page.tsx`

---

## 🗂️ Project structure

```
bible-stories-site/
├── app/
│   ├── books.ts          ← your book data (edit this to add books!)
│   ├── globals.css       ← global styles + watercolor background
│   ├── layout.tsx        ← root layout, fonts, SEO metadata
│   └── page.tsx          ← main homepage layout
├── components/
│   ├── BookCard.tsx      ← single book card
│   ├── BookCovers.tsx    ← SVG cover illustrations
│   └── RainbowArc.tsx    ← decorative rainbow in hero
├── package.json
├── tailwind.config.js    ← colors, fonts, animations
└── tsconfig.json
```

---

## ✨ What's included

- Mobile-responsive grid (1 / 2 / 3 columns)
- Smooth fade-up entrance animations
- Drifting clouds in the background
- Rainbow arc over the title
- Twinkling "Coming Soon" placeholder cards
- SEO-optimized metadata (Google + social sharing)
- Optimized fonts (no layout shift on load)
- Free hosting on Vercel with one-click deploy
