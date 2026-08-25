"use client";

import { useState } from "react";
import Image from "next/image";
import type { PeekPage } from "@/lib/peeks";

export default function PeekReader({
  pages,
  amazonUrl,
  image,
  title,
}: {
  pages: PeekPage[];
  amazonUrl?: string;
  image?: string;
  title: string;
}) {
  const [page, setPage] = useState(0);
  const current = pages[page];
  if (!current) return null;
  const last = page === pages.length - 1;

  return (
    <section
      id="peek"
      className="overflow-hidden rounded-3xl border border-white/80 bg-cream/90 shadow-md backdrop-blur-md"
    >
      <div className="grid lg:grid-cols-2">
        {image ? (
          <div className="relative min-h-56 bg-cream-deep">
            <Image
              src={image}
              alt=""
              fill
              className="object-contain p-4"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        ) : null}
        <div className="flex min-h-72 flex-col p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
            A bedtime peek · {page + 1} of {pages.length}
          </p>
          <h2 className="mt-2 font-display text-lg italic text-chestnut-soft">{title}</h2>
          <p className="mt-4 text-sm font-semibold text-terracotta">{current.kicker}</p>
          <p className="mt-3 font-display text-2xl leading-snug text-chestnut sm:text-3xl">
            {current.text}
          </p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-8">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="rounded-full border border-terracotta/25 bg-cream px-4 py-2 text-sm font-semibold text-chestnut-soft disabled:opacity-40"
            >
              ← Back
            </button>
            {last && amazonUrl ? (
              <a
                href={amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-cream shadow-md hover:bg-chestnut"
              >
                Get the picture book →
              </a>
            ) : (
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pages.length - 1, p + 1))}
                className="rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-cream shadow-md hover:bg-chestnut"
              >
                Next page →
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
