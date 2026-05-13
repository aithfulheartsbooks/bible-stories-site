"use client";

import { useState } from "react";
import SiteNav from "@/components/SiteNav";
import WinnerWheel from "@/components/WinnerWheel";

export default function PickWinnerPage() {
  const [raw, setRaw] = useState("");
  const [entries, setEntries] = useState<string[]>([]);

  function loadEntries() {
    const list = raw
      .split(/[\n,]+/)
      .map((e) => e.trim())
      .filter(Boolean);
    const unique = [...new Set(list)];
    setEntries(unique);
  }

  return (
    <main className="relative min-h-screen overflow-hidden font-body text-chestnut">
      <div className="scenery" />
      <SiteNav />

      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-24 text-center sm:pt-28">
        <span className="mb-6 inline-block rounded-full border border-terracotta/20 bg-white/55 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta backdrop-blur-sm">
          Admin · Pick a Winner
        </span>

        <h1 className="mb-4 font-display text-4xl font-extrabold text-chestnut sm:text-5xl">
          Spin the Wheel
        </h1>
        <p className="mb-10 text-base leading-relaxed text-chestnut-soft">
          Paste your list of entrant emails (one per line, or comma-separated)
          from Kit, then spin to pick this month&apos;s winner fairly.
        </p>

        {/* Entry list input */}
        <div className="mb-6 rounded-3xl border border-white/80 bg-cream/85 p-6 shadow-md backdrop-blur-md text-left">
          <label className="mb-2 block text-sm font-bold text-chestnut">
            Paste entrant emails
          </label>
          <textarea
            className="w-full rounded-2xl border border-chestnut/15 bg-white/70 p-4 text-sm text-chestnut placeholder-chestnut-soft/50 focus:outline-none focus:ring-2 focus:ring-terracotta/40 resize-y min-h-[140px]"
            placeholder={"jane@example.com\njohn@example.com\n…"}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
          />
          <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs text-chestnut-soft/70">
              {raw.split(/[\n,]+/).filter((e) => e.trim()).length} entries pasted
            </p>
            <button
              onClick={loadEntries}
              disabled={!raw.trim()}
              className="rounded-full bg-terracotta px-6 py-2.5 text-sm font-bold text-cream shadow-sm transition hover:bg-chestnut disabled:opacity-40"
            >
              Load onto wheel →
            </button>
          </div>
        </div>

        {entries.length > 0 && (
          <div className="rounded-3xl border border-white/80 bg-cream/85 p-6 shadow-md backdrop-blur-md">
            <p className="mb-6 text-sm font-semibold text-chestnut-soft">
              {entries.length} {entries.length === 1 ? "entry" : "entries"} loaded
            </p>
            <WinnerWheel entries={entries} />
          </div>
        )}

        <a
          href="/giveaway"
          className="mt-10 inline-flex rounded-full bg-white/70 px-5 py-2.5 text-sm font-semibold text-chestnut-soft shadow-sm backdrop-blur transition hover:bg-white hover:text-terracotta"
        >
          ← Back to Giveaway
        </a>
      </section>
    </main>
  );
}
