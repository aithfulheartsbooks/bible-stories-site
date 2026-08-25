"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BookCard from "@/components/BookCard";
import {
  BOOK_THEMES,
  kitForTheme,
  thisWeeksTheme,
  weekRangeLabel,
} from "@/lib/tonight";
import ChurchesShare from "./ChurchesShare";

const AMAZON_AUTHOR = "https://www.amazon.com/stores/author/B0GYBZMYD2";

export default function ChurchesClient() {
  const [theme, setTheme] = useState<string | null>(null);
  const [weekLabel, setWeekLabel] = useState("");
  const [weeklyTheme, setWeeklyTheme] = useState("");
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    const now = new Date();
    const weekly = thisWeeksTheme(now);
    setWeeklyTheme(weekly);
    setTheme(weekly);
    setWeekLabel(weekRangeLabel(now));
  }, []);

  const active = theme ?? weeklyTheme;
  const kit = active ? kitForTheme(active) : [];
  const isThisWeek = active === weeklyTheme;

  return (
    <div className="mx-auto max-w-3xl px-6 pb-16">
      <section className="rounded-3xl border border-white/80 bg-cream/85 p-6 text-center shadow-md sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
          {weekLabel ? `This week · ${weekLabel}` : "This week's kit"}
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold text-chestnut sm:text-4xl">
          {active ? `A lesson in ${active.toLowerCase()}` : "This week's lesson"}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-chestnut-soft">
          {isThisWeek
            ? "Three picture books for Sunday school or homeschool. The kit changes every Sunday. Order the paperbacks on Amazon."
            : `You chose ${active}. Next Sunday the featured kit will change on its own.`}
        </p>
      </section>

      {kit.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {kit.map((book, index) => (
            <BookCard key={book.slug} book={book} index={index} />
          ))}
        </div>
      ) : (
        <div className="mt-8 h-64 rounded-3xl bg-cream/70" />
      )}

      <section className="mt-10 rounded-3xl border border-white/80 bg-cream/85 p-6 shadow-sm sm:p-8">
        <h3 className="font-display text-2xl font-bold text-chestnut">
          How to use this kit
        </h3>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-chestnut-soft">
          <li>Read one story aloud — about five minutes.</li>
          <li>Ask: where did we see {active ? active.toLowerCase() : "God's love"} today?</li>
          <li>Send the paperback home. Each cover has its own Amazon button.</li>
        </ol>
        <a
          href={AMAZON_AUTHOR}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold text-cream shadow-md transition hover:bg-chestnut"
        >
          Shop the series on Amazon →
        </a>
      </section>

      {active ? <ChurchesShare theme={active} weekLabel={weekLabel} /> : null}

      <div className="mt-10 text-center">
        {picking ? (
          <>
            <p className="font-display text-xl font-bold text-chestnut">
              Need a different lesson this week?
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {BOOK_THEMES.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    setTheme(name);
                    setPicking(false);
                  }}
                  className={
                    name === active
                      ? "rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-cream"
                      : "rounded-full border border-terracotta/25 bg-cream/80 px-4 py-2 text-sm font-semibold text-chestnut-soft"
                  }
                >
                  {name}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 text-sm font-semibold text-chestnut-soft hover:text-terracotta"
              onClick={() => {
                setTheme(weeklyTheme);
                setPicking(false);
              }}
            >
              Back to this week's kit
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setPicking(true)}
            className="rounded-full border border-terracotta/25 bg-cream/80 px-5 py-2.5 text-sm font-semibold text-chestnut-soft shadow-sm hover:border-terracotta hover:text-terracotta"
          >
            Not this week's lesson? Pick another theme
          </button>
        )}
      </div>

      <p className="mt-8 text-center text-sm text-chestnut-soft">
        Looking for every book?{" "}
        <Link href="/#books" className="font-semibold text-terracotta hover:underline">
          See the full series
        </Link>
      </p>
    </div>
  );
}
