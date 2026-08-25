"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/app/books";
import {
  findTonight,
  todaysBook,
  type TonightLens,
  type TonightMood,
} from "@/lib/tonight";
import BookCard from "@/components/BookCard";

const MOODS: { id: TonightMood; title: string; blurb: string }[] = [
  { id: "brave", title: "Brave and ready", blurb: "Giants, lions, and small people who trust God." },
  { id: "cozy", title: "Quiet and cozy", blurb: "Soft voices, still waters, stories that settle the room." },
  { id: "curious", title: "Curious and wiggly", blurb: "Wonder, miracles, and \u201chow did God do that?\u201d" },
  { id: "hug", title: "Needs a hug", blurb: "Lost sheep, welcome home, Jesus who does not give up." },
];

const LENSES: { id: TonightLens; title: string }[] = [
  { id: "jesus", title: "Stories of Jesus" },
  { id: "heroes", title: "Old Testament heroes" },
  { id: "parable", title: "A parable" },
  { id: "holiday", title: "Christmas or Easter" },
  { id: "surprise", title: "Surprise us" },
];

export default function TonightClient() {
  const [nightly, setNightly] = useState<Book | null>(null);
  const [nightLabel, setNightLabel] = useState("");
  const [choosing, setChoosing] = useState(false);
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<TonightMood | null>(null);
  const [lens, setLens] = useState<TonightLens | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const now = new Date();
    setNightly(todaysBook(now));
    setNightLabel(
      now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);

  const picks = useMemo(() => {
    if (!mood || !lens) return [];
    return findTonight(mood, lens);
  }, [mood, lens]);

  const caption = nightly
    ? `Tonight's story: \u201c${nightly.title}.\u201d\nA new Bible picture book every night \u2014 ages 3\u20138.\nBible Stories for Little Hearts by Faith Rivers.\n#BibleStoriesForLittleHearts #ChristianChildrensBooks\nhttps://www.faithfulheartsbooks.com/tonight`
    : `It's bedtime and nobody knows what to read.\nA new picture book every night.\nhttps://www.faithfulheartsbooks.com/tonight`;

  async function copyCaption() {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pb-16">
      {nightly ? (
        <section className="rounded-3xl border border-white/80 bg-cream/85 p-5 shadow-md backdrop-blur-md sm:p-8">
          {nightly.coverImage ? (
            <div className="relative mx-auto mb-6 aspect-[2/3] w-full max-w-[280px]">
              <Image
                src={nightly.coverImage}
                alt={`${nightly.title} cover`}
                fill
                className="object-contain"
                sizes="280px"
                priority
              />
            </div>
          ) : null}
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
            Tonight \u00b7 {nightLabel}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-chestnut sm:text-4xl">
            {nightly.title}
          </h2>
          {nightly.subtitle ? (
            <p className="mt-2 font-display text-lg italic text-chestnut-soft">
              {nightly.subtitle}
            </p>
          ) : null}
          {nightly.blurb ? (
            <p className="mt-4 text-chestnut-soft">{nightly.blurb}</p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            {nightly.amazonUrl ? (
              <a
                href={nightly.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold text-cream shadow-md transition hover:scale-105 hover:bg-chestnut"
              >
                Find on Amazon \u2192
              </a>
            ) : null}
            <Link
              href={`/book/${nightly.slug}`}
              className="inline-flex items-center justify-center rounded-full border border-terracotta/25 bg-cream px-6 py-3.5 text-sm font-semibold text-chestnut-soft transition hover:border-terracotta hover:text-terracotta"
            >
              Open the book page
            </Link>
          </div>
          <p className="mt-4 text-sm text-chestnut-soft">
            Tomorrow this page will hold a different story \u2014 every book takes a
            turn.
          </p>
        </section>
      ) : (
        <div className="h-80 rounded-3xl bg-cream/70" />
      )}

      <div className="mt-8">
        {choosing ? (
          <button
            type="button"
            onClick={() => {
              setChoosing(false);
              setMood(null);
              setLens(null);
              setStep(1);
            }}
            className="rounded-full px-4 py-2 text-sm font-semibold text-chestnut-soft hover:text-terracotta"
          >
            Keep tonight's pick
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setChoosing(true)}
            className="rounded-full border border-terracotta/25 bg-cream/80 px-5 py-2.5 text-sm font-semibold text-chestnut-soft shadow-sm transition hover:border-terracotta hover:text-terracotta"
          >
            Not this mood? Pick another
          </button>
        )}
      </div>

      {choosing ? (
        <div className="mt-6">
          {step === 1 ? (
            <fieldset>
              <legend className="font-display text-2xl font-bold text-chestnut">
                How is your little heart tonight?
              </legend>
              <div className="mt-4 grid gap-3">
                {MOODS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setMood(item.id);
                      setStep(2);
                    }}
                    className="rounded-3xl border border-white/80 bg-cream/85 p-5 text-left shadow-sm transition hover:-translate-y-0.5"
                  >
                    <span className="block font-display text-xl font-bold text-chestnut">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-sm text-chestnut-soft">
                      {item.blurb}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
          ) : null}

          {step === 2 ? (
            <fieldset>
              <legend className="font-display text-2xl font-bold text-chestnut">
                What kind of story?
              </legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {LENSES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLens(item.id)}
                    className="min-h-[56px] rounded-3xl border border-white/80 bg-cream/85 px-4 py-4 text-left font-semibold text-chestnut shadow-sm transition hover:-translate-y-0.5"
                  >
                    {item.title}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="mt-4 text-sm font-semibold text-chestnut-soft hover:text-terracotta"
                onClick={() => setStep(1)}
              >
                Back
              </button>
            </fieldset>
          ) : null}

          {lens && picks.length > 0 ? (
            <div className="mt-10">
              <h2 className="font-display text-3xl font-bold text-chestnut">
                Three books for this mood
              </h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                {picks.map((book, index) => (
                  <BookCard key={book.slug} book={book} index={index} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <section className="mt-12 rounded-3xl border border-white/80 bg-cream/85 p-5 shadow-sm sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
          For posting
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold text-chestnut">
          Share tonight's story
        </h2>
        <p className="mt-3 whitespace-pre-wrap rounded-2xl bg-cream-deep/80 px-4 py-3 text-sm leading-relaxed text-chestnut-soft">
          {caption}
        </p>
        <button
          type="button"
          onClick={copyCaption}
          className="mt-4 inline-flex rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-cream shadow-md transition hover:bg-chestnut"
        >
          {copied ? "Copied" : "Copy caption"}
        </button>
      </section>
    </div>
  );
}
