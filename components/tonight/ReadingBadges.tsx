"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  countedSlugs,
  collectBookFrom,
  commitRemoteCollection,
  readCollectionFrom,
  TONIGHT_BADGE_STORAGE_KEY,
  type CollectionState,
} from "@/lib/tonight-collection";
import { seriesBadges, seriesSlugSet } from "@/lib/tonight-catalog";

const messages = {
  unavailable: "This browser couldn't open saved badges. Nothing was collected.",
  malformed: "Saved badges in this browser couldn't be read. Nothing new was collected.",
  "write-failed": "This browser didn't keep the badge. It was not collected.",
  "unknown-book": "This story has no badge on the chart.",
  localOnly: "Badges stay in this browser. Clearing site data, or another phone, starts over.",
};

export default function ReadingBadges({ slug }: { slug: string }) {
  const [state, setState] = useState<CollectionState | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const slugsRef = useRef<string[]>([]);

  useEffect(() => {
    const initial = readCollectionFrom(() => window.localStorage);
    if (initial.status === "ready") slugsRef.current = initial.slugs;
    setState(initial);

    function onStorage(event: StorageEvent) {
      if (event.key !== TONIGHT_BADGE_STORAGE_KEY && event.key !== null) return;
      const committed = commitRemoteCollection(
        () => window.localStorage,
        slugsRef.current,
        event.newValue,
      );
      if (committed.action === "keep") return;
      slugsRef.current = committed.slugs;
      setState({ status: "ready", slugs: committed.slugs });
      setNotice(committed.notice ? messages[committed.notice] : null);
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function onCollect() {
    const result = collectBookFrom(() => window.localStorage, slug, seriesSlugSet);
    if (result.status === "saved") {
      slugsRef.current = result.slugs;
      setState({ status: "ready", slugs: result.slugs });
      setNotice(null);
      return;
    }
    setNotice(messages[result.reason]);
    if (result.reason === "malformed" || result.reason === "unavailable") {
      setState({ status: result.reason });
    }
  }

  const ready = state?.status === "ready" ? state : null;
  const collected = new Set(ready ? countedSlugs(ready.slugs, seriesSlugSet) : []);
  const tonightCollected = collected.has(slug);
  const tonightBadge = seriesBadges.find((badge) => badge.slug === slug);
  const progress = !state
    ? "Checking saved badges."
    : state.status === "ready"
      ? `${collected.size} of ${seriesBadges.length} collected.${tonightCollected ? " Tonight is on the chart." : ""}`
      : messages[state.status];

  function printChart() {
    document.body.classList.add("printing-tonight-chart");
    const cleanup = () => {
      document.body.classList.remove("printing-tonight-chart");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
  }

  return (
    <section
      className="tonight-badge-chart mt-8 rounded-3xl border border-white/80 bg-cream/85 p-5 shadow-sm"
      data-tonight-slug={slug}
      aria-labelledby="reading-badges-heading"
    >
      <div className="tonight-print-header" hidden>
        <h2 className="font-display text-2xl font-bold text-chestnut">Reading badges</h2>
        <p className="text-sm text-chestnut-soft">{progress}</p>
      </div>
      <div className="tonight-screen-controls flex items-start gap-4">
        {tonightBadge ? (
          <BadgeFace badge={tonightBadge} collected={tonightCollected} fixed />
        ) : (
          <div className="h-12 w-12 shrink-0" />
        )}
        <div className="min-w-0 flex-1">
          <h2 id="reading-badges-heading" className="font-display text-2xl font-bold text-chestnut">
            Reading badges
          </h2>
          <p className="mt-1 text-sm text-chestnut-soft" role="status">
            {notice && notice !== progress ? `${progress} ${notice}` : progress}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onCollect}
              aria-pressed={tonightCollected}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-5 py-3 text-sm font-semibold text-chestnut shadow-md transition hover:bg-terracotta hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chestnut"
            >
              {tonightCollected ? "Collected" : "Collect this story"}
            </button>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="tonight-badge-grid"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-terracotta/25 bg-cream px-4 py-3 text-sm font-semibold text-chestnut-soft"
            >
              {open ? "Hide the chart" : `Show all ${seriesBadges.length} badges`}
            </button>
            <button
              type="button"
              onClick={printChart}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-terracotta/25 bg-cream px-4 py-3 text-sm font-semibold text-chestnut-soft"
            >
              Print chart
            </button>
          </div>
        </div>
      </div>
      <p className="tonight-screen-controls mt-3 text-xs text-chestnut-soft">
        {ready ? messages.localOnly : ""}
      </p>
      <div
        id="tonight-badge-grid"
        className={
          open
            ? "tonight-badge-grid mt-4 grid grid-cols-6 gap-2"
            : "tonight-badge-grid mt-4 hidden grid-cols-6 gap-2"
        }
      >
        {seriesBadges.map((badge) => (
          <figure key={badge.slug} className="tonight-badge-cell min-w-0" aria-label={badge.title}>
            <BadgeFace badge={badge} collected={collected.has(badge.slug)} />
            <figcaption className="tonight-badge-title mt-1 hidden text-center text-[10px] leading-tight text-chestnut-soft">
              {badge.numberLabel}. {badge.title}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function BadgeFace({
  badge,
  collected,
  fixed = false,
}: {
  badge: { numberLabel: string; title: string; coverImage: string };
  collected: boolean;
  fixed?: boolean;
}) {
  const frame = fixed ? "relative h-12 w-12 shrink-0" : "relative aspect-square w-full";
  const tone = collected ? "border-gold" : "border-chestnut/15";
  return (
    <div className={`tonight-badge-face ${frame} overflow-hidden rounded-full border-2 ${tone} bg-cream-deep`}>
      <Image
        src={badge.coverImage}
        alt=""
        width={48}
        height={48}
        sizes="48px"
        className={
          collected
            ? "h-full w-full object-cover"
            : "h-full w-full object-cover grayscale"
        }
      />
      {collected ? null : (
        <span
        className={`absolute inset-0 flex items-center justify-center bg-chestnut/45 font-bold text-cream ${fixed ? "text-sm" : "text-[11px]"}`}
      >
          {badge.numberLabel}
        </span>
      )}
      <span className="sr-only">
        {badge.title}, {collected ? "collected" : "not collected"}
      </span>
    </div>
  );
}
