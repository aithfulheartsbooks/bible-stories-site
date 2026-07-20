"use client";

import { FormEvent, useMemo, useState } from "react";
import { books, Book } from "@/app/books";

const ACCESS_CODE = "littlehearts";

const CAPTION_STYLES = [
  {
    key: "spotlight",
    label: "Book Spotlight",
    emoji: "✨",
    description: "Promotional highlight",
  },
  {
    key: "devotional",
    label: "Devotional",
    emoji: "📖",
    description: "Scripture-centered",
  },
  {
    key: "gift",
    label: "Gift Idea",
    emoji: "🎁",
    description: "For gifters & grandparents",
  },
  {
    key: "lesson",
    label: "Faith Lesson",
    emoji: "🌟",
    description: "Teaching a theme",
  },
  {
    key: "community",
    label: "Community",
    emoji: "💬",
    description: "Engagement question",
  },
];

const HASHTAG_GROUPS: {
  key: string;
  label: string;
  tags: string[];
  locked?: boolean;
}[] = [
  {
    key: "core",
    label: "Brand",
    locked: true,
    tags: [
      "#BibleStoriesForLittleHearts",
      "#FaithRiversBooks",
      "#FaithfulHeartsBooks",
    ],
  },
  {
    key: "books",
    label: "Children's Books",
    tags: [
      "#KidsBooks",
      "#ChildrensBooks",
      "#PictureBooks",
      "#KidsBooksOfInstagram",
      "#BookstagramKids",
      "#ToddlerBooks",
      "#PreschoolBooks",
    ],
  },
  {
    key: "faith",
    label: "Faith & Family",
    tags: [
      "#ChristianKids",
      "#BibleForKids",
      "#FaithAndFamily",
      "#ChristianMom",
      "#BibleStories",
      "#GodIsGood",
      "#ChristianParenting",
      "#SundaySchool",
    ],
  },
  {
    key: "parenting",
    label: "Parenting",
    tags: [
      "#ChristianParents",
      "#BiblicalParenting",
      "#RaisingFaithfulKids",
      "#FamilyDevotional",
      "#ReadAloud",
      "#BedtimeStories",
    ],
  },
  {
    key: "gifts",
    label: "Gift Ideas",
    tags: [
      "#GiftIdeas",
      "#ChristianGifts",
      "#BaptismGift",
      "#ChristmasGifts",
      "#EasterBasket",
      "#KidGiftIdeas",
    ],
  },
];

const THEME_HASHTAGS: Record<string, string[]> = {
  Trust: ["#TrustGod", "#FaithOverFear", "#TrustInTheLord"],
  Courage: ["#BibleCourage", "#GodIsWithMe", "#BeStrong"],
  Faith: ["#FaithInGod", "#WalkByFaith", "#TrustInHim"],
  Obedience: ["#ObeyGod", "#GodsPlan", "#TrustAndObey"],
  Prayer: ["#PrayerLife", "#KidsPrayer", "#TeachThemToPray"],
  Bravery: ["#BeTheBrave", "#GodsStrength", "#CourageousFaith"],
  Love: ["#GodsLove", "#LoveOneAnother", "#FaithAndLove"],
  Forgiveness: ["#ForgivenessIsKey", "#GodForgives", "#ChristianForgiveness"],
  Hope: ["#HopeInChrist", "#EasterHope", "#Resurrection"],
  "Loyal Love": ["#LoyalLove", "#FaithfulFriend", "#GodsLoyalty"],
};

function buildCaption(book: Book, style: string): string {
  const theme = book.theme ?? "Faith";
  const scripture = book.scriptureReference ?? "The Bible";
  const blurb =
    book.blurb ?? "A beautiful Bible story for little hearts ages 3–8.";

  switch (style) {
    case "spotlight":
      return `✨ Meet ${book.title}! ✨\n\n${blurb}\n\n📖 Based on ${scripture}\n🌟 Theme: ${theme}\n\nPerfect for little ones ages 3–8! Available on Amazon now. 🔗 Link in bio!`;

    case "devotional":
      return `📖 "${scripture}" — A verse worth sharing with your little ones today.\n\nIn our book ${book.title}, we explore the beautiful theme of ${theme} through a story little hearts will love and remember.\n\n${blurb}\n\nHow are you teaching ${theme} to your children? Share below! 👇`;

    case "gift":
      return `🎁 Looking for the perfect gift for the little ones in your life?\n\n${book.title} makes a beautiful and meaningful gift for any child ages 3–8!\n\n${blurb}\n\n🌟 Theme: ${theme}\n📖 ${scripture}\n\nOrder yours on Amazon today! 🔗 Link in bio.`;

    case "lesson":
      return `🌟 Today's little hearts lesson: ${theme}! 🌟\n\nIn ${book.title}, little hearts discover what it means to have ${theme} through the story of ${scripture} — told with wonder, warmth, and faith.\n\n${blurb}\n\nRead it together tonight! 📚💕`;

    case "community":
      return `💬 Question for you! How do you teach ${theme} to your children?\n\nIn ${book.title}, little hearts explore ${theme} through the story of ${scripture}.\n\n${blurb}\n\nDrop your tips and ideas in the comments below! 👇✨`;

    default:
      return "";
  }
}

// ── Lock screen ──────────────────────────────────────────────────────────────

function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (code.trim().toLowerCase() === ACCESS_CODE) {
      onUnlock();
    } else {
      setError("Please enter the correct access code.");
    }
  }

  return (
    <section className="relative z-10 mx-auto flex min-h-screen max-w-xl items-center px-6 py-24">
      <div className="w-full rounded-3xl border border-white/80 bg-cream/85 p-8 text-center shadow-md backdrop-blur-md md:p-10">
        <div className="mb-4 text-5xl">📸</div>
        <h1 className="font-display text-3xl font-bold text-chestnut">
          Instagram Management
        </h1>
        <p className="mt-2 text-sm text-chestnut/60">Internal tool</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter access code"
            className="w-full rounded-2xl border border-chestnut/15 bg-white/70 px-4 py-3 text-center text-sm text-chestnut outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-terracotta px-6 py-3 text-sm font-bold text-cream"
          >
            Open Dashboard
          </button>
        </form>

        {error ? <p className="mt-4 text-sm text-terracotta">{error}</p> : null}
      </div>
    </section>
  );
}

// ── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      onClick={handleCopy}
      className="rounded-full bg-terracotta px-5 py-2 text-xs font-bold text-cream transition hover:bg-chestnut"
    >
      {copied ? "Copied!" : label}
    </button>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────

function Dashboard() {
  const availableBooks = useMemo(
    () => books.filter((b) => b.status === "available"),
    [],
  );

  const [selectedBook, setSelectedBook] = useState<Book>(availableBooks[0]);
  const [captionStyle, setCaptionStyle] = useState("spotlight");
  const [activeTagGroups, setActiveTagGroups] = useState<Set<string>>(
    new Set(["core", "books", "faith"]),
  );
  const [customTags, setCustomTags] = useState("");

  const caption = useMemo(
    () => buildCaption(selectedBook, captionStyle),
    [selectedBook, captionStyle],
  );

  const hashtags = useMemo(() => {
    const tags: string[] = [];

    for (const group of HASHTAG_GROUPS) {
      if (activeTagGroups.has(group.key)) {
        tags.push(...group.tags);
      }
    }

    const themeTags = THEME_HASHTAGS[selectedBook.theme ?? ""] ?? [];
    tags.push(...themeTags);

    if (customTags.trim()) {
      const extra = customTags
        .trim()
        .split(/\s+/)
        .map((t) => (t.startsWith("#") ? t : `#${t}`));
      tags.push(...extra);
    }

    return [...new Set(tags)];
  }, [activeTagGroups, selectedBook, customTags]);

  const hashtagString = hashtags.join(" ");
  const fullPost = `${caption}\n\n.\n.\n.\n${hashtagString}`;
  const captionLength = fullPost.length;
  const hashtagCount = hashtags.length;

  function toggleGroup(key: string) {
    setActiveTagGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-24 sm:pt-28">
      {/* Header */}
      <div className="mb-10 text-center">
        <span className="mb-4 inline-block rounded-full border border-terracotta/20 bg-white/55 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta backdrop-blur-sm">
          Hidden Internal Tool
        </span>
        <h1 className="font-display text-5xl font-extrabold text-chestnut">
          Instagram Management
        </h1>
        <p className="mt-3 text-chestnut/60">
          Generate captions and hashtags for every book in the series.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left column */}
        <div className="space-y-8">
          {/* Book selector */}
          <div className="rounded-3xl border border-white/80 bg-cream/85 p-6 shadow-md backdrop-blur-md">
            <h2 className="mb-4 font-display text-xl font-bold text-chestnut">
              1. Choose a Book
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {availableBooks.map((book) => (
                <button
                  key={book.slug}
                  onClick={() => setSelectedBook(book)}
                  className={`rounded-2xl border px-3 py-3 text-left text-xs transition ${
                    selectedBook.slug === book.slug
                      ? "border-terracotta bg-terracotta/10 font-bold text-terracotta"
                      : "border-chestnut/10 bg-white/50 text-chestnut hover:border-terracotta/30 hover:bg-white/80"
                  }`}
                >
                  <span className="block text-[10px] font-semibold uppercase tracking-widest text-chestnut/40">
                    {book.number}
                  </span>
                  <span className="mt-0.5 block leading-snug">{book.title}</span>
                  {book.theme ? (
                    <span className="mt-1 block text-[10px] text-chestnut/40">
                      {book.theme}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          {/* Caption style */}
          <div className="rounded-3xl border border-white/80 bg-cream/85 p-6 shadow-md backdrop-blur-md">
            <h2 className="mb-4 font-display text-xl font-bold text-chestnut">
              2. Caption Style
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {CAPTION_STYLES.map((style) => (
                <button
                  key={style.key}
                  onClick={() => setCaptionStyle(style.key)}
                  className={`rounded-2xl border px-3 py-3 text-center text-xs transition ${
                    captionStyle === style.key
                      ? "border-terracotta bg-terracotta/10 font-bold text-terracotta"
                      : "border-chestnut/10 bg-white/50 text-chestnut hover:border-terracotta/30 hover:bg-white/80"
                  }`}
                >
                  <span className="block text-2xl">{style.emoji}</span>
                  <span className="mt-1 block font-semibold">{style.label}</span>
                  <span className="mt-0.5 block text-[10px] text-chestnut/50">
                    {style.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Caption preview */}
          <div className="rounded-3xl border border-white/80 bg-cream/85 p-6 shadow-md backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-chestnut">
                3. Caption Preview
              </h2>
              <CopyButton text={caption} label="Copy Caption" />
            </div>
            <pre className="whitespace-pre-wrap rounded-2xl border border-chestnut/10 bg-white/60 p-4 font-body text-sm leading-relaxed text-chestnut">
              {caption}
            </pre>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-8">
          {/* Selected book info */}
          <div className="rounded-3xl border border-white/80 bg-cream/85 p-6 shadow-md backdrop-blur-md">
            <h2 className="mb-3 font-display text-lg font-bold text-chestnut">
              Selected Book
            </h2>
            <p className="font-display text-2xl font-bold text-terracotta">
              {selectedBook.title}
            </p>
            {selectedBook.subtitle ? (
              <p className="mt-1 text-sm italic text-chestnut/60">
                {selectedBook.subtitle}
              </p>
            ) : null}
            <div className="mt-3 space-y-1 text-xs text-chestnut/70">
              {selectedBook.theme ? (
                <p>
                  <span className="font-semibold">Theme:</span>{" "}
                  {selectedBook.theme}
                </p>
              ) : null}
              {selectedBook.scriptureReference ? (
                <p>
                  <span className="font-semibold">Scripture:</span>{" "}
                  {selectedBook.scriptureReference}
                </p>
              ) : null}
            </div>
          </div>

          {/* Hashtag manager */}
          <div className="rounded-3xl border border-white/80 bg-cream/85 p-6 shadow-md backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-chestnut">
                Hashtags
              </h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  hashtagCount > 30
                    ? "bg-terracotta/20 text-terracotta"
                    : "bg-sage/20 text-chestnut"
                }`}
              >
                {hashtagCount}/30
              </span>
            </div>

            {/* Group toggles */}
            <div className="space-y-2">
              {HASHTAG_GROUPS.map((group) => (
                <button
                  key={group.key}
                  onClick={() => !group.locked && toggleGroup(group.key)}
                  disabled={group.locked}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-xs transition ${
                    group.locked
                      ? "cursor-default border-chestnut/10 bg-white/40 text-chestnut/50"
                      : activeTagGroups.has(group.key)
                        ? "border-terracotta/30 bg-terracotta/10 text-terracotta"
                        : "border-chestnut/10 bg-white/40 text-chestnut/60 hover:bg-white/70"
                  }`}
                >
                  <span className="font-semibold">{group.label}</span>
                  <span className="text-[10px] text-chestnut/40">
                    {group.locked ? "always on" : activeTagGroups.has(group.key) ? "on" : "off"}{" "}
                    · {group.tags.length} tags
                  </span>
                </button>
              ))}

              {/* Theme tags */}
              {(THEME_HASHTAGS[selectedBook.theme ?? ""] ?? []).length > 0 ? (
                <div className="rounded-xl border border-gold/30 bg-gold/10 px-3 py-2 text-xs">
                  <p className="font-semibold text-chestnut/70">
                    Theme tags (auto)
                  </p>
                  <p className="mt-1 text-chestnut/50">
                    {(THEME_HASHTAGS[selectedBook.theme ?? ""] ?? []).join(
                      " ",
                    )}
                  </p>
                </div>
              ) : null}
            </div>

            {/* Custom tags */}
            <div className="mt-4">
              <label className="mb-1 block text-xs font-semibold text-chestnut/60">
                Custom tags
              </label>
              <input
                type="text"
                value={customTags}
                onChange={(e) => setCustomTags(e.target.value)}
                placeholder="#YourTag #AnotherTag"
                className="w-full rounded-xl border border-chestnut/15 bg-white/70 px-3 py-2 text-xs text-chestnut outline-none"
              />
            </div>

            {/* Hashtag preview */}
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold text-chestnut/60">
                Preview
              </p>
              <p className="rounded-xl border border-chestnut/10 bg-white/60 p-3 text-[11px] leading-relaxed text-chestnut/70">
                {hashtagString || (
                  <span className="italic text-chestnut/30">
                    No hashtags selected
                  </span>
                )}
              </p>
            </div>

            <div className="mt-3 flex justify-end">
              <CopyButton text={hashtagString} label="Copy Hashtags" />
            </div>
          </div>

          {/* Copy all */}
          <div className="rounded-3xl border border-white/80 bg-cream/85 p-6 shadow-md backdrop-blur-md">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-chestnut">
                Full Post
              </h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  captionLength > 2200
                    ? "bg-terracotta/20 text-terracotta"
                    : "bg-sage/20 text-chestnut"
                }`}
              >
                {captionLength}/2200 chars
              </span>
            </div>
            <p className="mb-4 text-xs text-chestnut/50">
              Caption + dot separators + hashtags — ready to paste into
              Instagram.
            </p>
            <CopyButton text={fullPost} label="Copy Full Post" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────

export default function InstagramClient() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return <LockScreen onUnlock={() => setUnlocked(true)} />;
  }

  return <Dashboard />;
}
