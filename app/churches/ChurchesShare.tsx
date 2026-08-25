"use client";

import { useState } from "react";

export default function ChurchesShare({
  theme,
  weekLabel,
}: {
  theme: string;
  weekLabel?: string;
}) {
  const [copied, setCopied] = useState(false);
  const caption = `This week's Sunday school kit${weekLabel ? ` (${weekLabel})` : ""}: ${theme}.\nThree picture books for little hearts — paperbacks on Amazon.\nBible Stories for Little Hearts by Faith Rivers.\n#SundaySchool #ChristianChildrensBooks\nhttps://www.faithfulheartsbooks.com/churches`;

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
    <section className="mt-10 rounded-3xl border border-white/80 bg-cream/85 p-5 text-left shadow-sm sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
        Share with a teacher
      </p>
      <h2 className="mt-2 font-display text-2xl font-bold text-chestnut">
        Share this week's kit
      </h2>
      <p className="mt-2 text-sm text-chestnut-soft">
        Send this to a teacher, friend, or homeschool group.
      </p>
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
  );
}
