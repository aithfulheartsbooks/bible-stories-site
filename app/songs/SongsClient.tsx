"use client";

import { memo, useMemo, useRef, useState, type Ref } from "react";
import {
  SONG_GROUPS,
  findSong,
  groupCount,
  lyricPlainText,
  songSearchText,
  songs,
  type Song,
  type SongGroupId,
} from "@/lib/songs";
import { startSingAlongFromTap } from "@/lib/sing-along-player";

type GroupFilter = "all" | SongGroupId;

/** Soft rotations of the site's gold, terracotta, pink, sky, lavender, and sage. */
const BADGES = [
  { bg: "#e0a84a", ring: "#f6e3b8" },
  { bg: "#e08a68", ring: "#f6d2c4" },
  { bg: "#e7a3b5", ring: "#f8dce4" },
  { bg: "#7aa3bf", ring: "#d5e6f2" },
  { bg: "#b59bcb", ring: "#e6daf2" },
  { bg: "#8fb48c", ring: "#d7ead4" },
] as const;

function badgeFor(slug: string) {
  const index = Math.max(0, songs.findIndex((song) => song.slug === slug));
  return BADGES[index % BADGES.length];
}

function countLabel(count: number) {
  return `${count} ${count === 1 ? "song" : "songs"}`;
}

function groupLabel(group: SongGroupId) {
  return SONG_GROUPS.find((item) => item.id === group)?.title ?? "Songs";
}

export default function SongsClient({ initialSlug }: { initialSlug?: string }) {
  const initial = findSong(initialSlug);
  const [slug, setSlug] = useState(initial.slug);
  const [videoOn, setVideoOn] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<GroupFilter>("all");
  const [copied, setCopied] = useState(false);
  const [sung, setSung] = useState<string[]>([]);
  const [activeLine, setActiveLine] = useState<number | null>(null);

  const current = findSong(slug);
  const playerHostRef = useRef<HTMLDivElement>(null);
  const needle = query.trim().toLowerCase();

  const visible = useMemo(() => {
    return songs.filter((song) => {
      if (filter !== "all" && song.group !== filter) return false;
      if (!needle) return true;
      return songSearchText(song).includes(needle);
    });
  }, [filter, needle]);

  const sequence = visible.some((song) => song.slug === current.slug) ? visible : songs;
  const index = Math.max(0, sequence.findIndex((song) => song.slug === current.slug));
  const upcoming = sequence[(index + 1) % sequence.length];

  function markSung(nextSlug: string) {
    setSung((prev) => (prev.includes(nextSlug) ? prev : [...prev, nextSlug]));
  }

  function choose(nextSlug: string, play: boolean) {
    const next = findSong(nextSlug);
    const host = playerHostRef.current;
    if (host) {
      if (play) {
        const frame = host.querySelector("iframe");
        const sameVideo = Boolean(videoOn && frame?.src.includes(`/embed/${next.videoId}`));
        if (!sameVideo) {
          startSingAlongFromTap<HTMLIFrameElement>(
            {
              replaceChildren(node) {
                host.replaceChildren(node);
              },
              ownerDocument: {
                createElement: (tag) => host.ownerDocument.createElement(tag),
              },
            },
            next.videoId,
            next.title,
            window.location.origin,
          );
        }
      } else {
        host.replaceChildren();
      }
    }
    setSlug(nextSlug);
    setActiveLine(null);
    setCopied(false);
    if (play) {
      setVideoOn(true);
      markSung(nextSlug);
    } else {
      setVideoOn(false);
    }
  }

  function step(direction: -1 | 1) {
    const next = sequence[(index + direction + sequence.length) % sequence.length];
    choose(next.slug, videoOn);
  }

  async function copyLyrics() {
    const text = lyricPlainText(current);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const sungLabel =
    sung.length === 1 ? "1 song sung this visit" : `${sung.length} songs sung this visit`;

  return (
    <div className="relative z-10 mx-auto max-w-6xl px-4 pb-4 sm:px-6">
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
          <article
            className="rounded-3xl border border-white/80 bg-cream p-4 shadow-md sm:p-5"
            data-now-playing={current.slug}
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <NoteBadge slug={current.slug} size="lg" />
              <div className="min-w-0">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-terracotta">
                  Now playing · {groupLabel(current.group)}
                </p>
                <p className="font-display text-2xl font-bold leading-tight text-chestnut sm:text-3xl">
                  {current.title}
                </p>
                <p className="mt-1 text-sm text-chestnut-soft">{current.blurb}</p>
              </div>
            </div>

            <SingAlongVideo
              song={current}
              playing={videoOn}
              hostRef={playerHostRef}
              onPlay={() => choose(current.slug, true)}
            />

            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => step(-1)}
                className="grid h-11 w-11 place-items-center rounded-full border border-terracotta/30 bg-cream text-chestnut shadow-sm transition hover:border-terracotta hover:text-terracotta"
                aria-label="Previous song"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => choose(current.slug, true)}
                className="grid h-14 w-14 place-items-center rounded-full bg-terracotta text-xl text-cream shadow-md transition hover:bg-chestnut"
                aria-label={`Play ${current.title}`}
              >
                ▶
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="grid h-11 w-11 place-items-center rounded-full border border-terracotta/30 bg-cream text-chestnut shadow-sm transition hover:border-terracotta hover:text-terracotta"
                aria-label="Next song"
              >
                ›
              </button>
            </div>
            <p className="mt-3 text-center text-sm text-chestnut-soft">
              Up next:{" "}
              <button
                type="button"
                className="font-display font-bold text-chestnut underline-offset-2 hover:text-terracotta hover:underline"
                onClick={() => choose(upcoming.slug, true)}
              >
                {upcoming.title}
              </button>
            </p>
            <p className="mt-3 flex gap-2 rounded-2xl bg-[#fbf6df] px-3 py-2.5 text-sm leading-snug text-chestnut-soft">
              <span aria-hidden>💡</span>
              <span>{current.tip}</span>
            </p>
          </article>

          <section
            className="mt-4 rounded-3xl border border-white/80 bg-cream p-4 shadow-md sm:p-5"
            aria-labelledby="lyrics-heading"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 id="lyrics-heading" className="font-display text-xl font-bold text-chestnut">
                Lyrics
              </h2>
              {current.lyricsStatus === "lyrics-ok" ? (
                <button
                  type="button"
                  onClick={copyLyrics}
                  className="rounded-full border border-terracotta/25 bg-cream px-3 py-1.5 text-xs font-semibold text-chestnut-soft shadow-sm transition hover:border-terracotta hover:text-terracotta"
                >
                  {copied ? "Copied" : "Copy lyrics"}
                </button>
              ) : null}
            </div>
            {current.lyricsStatus === "lyrics-ok" ? (
              <>
                <LyricLines song={current} activeLine={activeLine} />
                <p className="mt-3 text-xs leading-relaxed text-chestnut-soft/80">
                  Traditional words — in the public domain.
                </p>
              </>
            ) : (
              <p className="mt-4 text-sm text-chestnut-soft">Sing along with the video.</p>
            )}
          </section>
        </div>

        <div>
          <label className="block">
            <span className="sr-only">Search songs</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder='Search songs — try "ark" or "joy"'
              className="w-full rounded-full border border-white/80 bg-cream px-5 py-3 text-sm text-chestnut shadow-sm outline-none ring-terracotta/30 placeholder:text-chestnut-soft/70 focus:ring-2"
            />
          </label>

          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Song groups">
            <FilterPill pressed={filter === "all"} onClick={() => setFilter("all")}>
              All songs
            </FilterPill>
            <FilterPill pressed={filter === "action"} onClick={() => setFilter("action")}>
              Action
            </FilterPill>
            <FilterPill pressed={filter === "gentle"} onClick={() => setFilter("gentle")}>
              Gentle
            </FilterPill>
            <FilterPill pressed={filter === "story"} onClick={() => setFilter("story")}>
              Story songs
            </FilterPill>
            <span className="inline-flex items-center rounded-full border border-terracotta/20 bg-cream px-3 py-1.5 text-xs font-semibold text-terracotta">
              ♥ {sungLabel}
            </span>
          </div>

          {visible.length === 0 ? (
            <p className="mt-6 rounded-3xl border border-white/80 bg-cream px-5 py-8 text-center text-sm text-chestnut-soft shadow-sm">
              No songs match that search.
            </p>
          ) : null}

          {SONG_GROUPS.map((group) => {
            const inGroup = visible.filter((song) => song.group === group.id);
            if (inGroup.length === 0) return null;
            const total = groupCount(group.id);
            const dot = badgeFor(songs.find((song) => song.group === group.id)?.slug ?? inGroup[0].slug);
            return (
              <section key={group.id} className="mt-6" aria-labelledby={`group-${group.id}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: dot.bg }} aria-hidden />
                  <h2 id={`group-${group.id}`} className="font-display text-2xl font-bold text-chestnut">
                    {group.title}
                  </h2>
                  <span className="rounded-full bg-cream-deep px-2.5 py-0.5 text-xs font-semibold text-chestnut-soft">
                    {countLabel(total)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-chestnut-soft">{group.blurb}</p>
                <ul className="mt-3 space-y-3">
                  {inGroup.map((song) => {
                    const selected = song.slug === current.slug;
                    return (
                      <li key={song.slug}>
                        <article
                          className={`rounded-[1.35rem] border p-3 shadow-sm transition ${
                            selected
                              ? "border-terracotta bg-[#fff6f1] shadow-md"
                              : "border-[#f0e6d6] bg-cream"
                          }`}
                          data-song={song.slug}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => choose(song.slug, true)}
                              className="flex min-w-0 flex-1 items-center gap-3 text-left"
                            >
                              <NoteBadge slug={song.slug} />
                              <span className="min-w-0">
                                <span className="block font-display text-base font-bold leading-tight text-chestnut sm:text-lg">
                                  {song.title}
                                </span>
                                <span className="mt-0.5 block text-sm leading-snug text-chestnut-soft">
                                  {song.tip}
                                </span>
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => choose(song.slug, true)}
                              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                                selected
                                  ? "bg-terracotta text-cream"
                                  : "bg-terracotta/15 text-terracotta hover:bg-terracotta/25"
                              }`}
                            >
                              <PlayArrow />
                              Play
                            </button>
                          </div>
                          {song.bookLink ? (
                            <p className="mt-2 pl-14 text-sm">
                              <a
                                href={song.bookLink.href}
                                className="font-semibold text-terracotta underline-offset-2 hover:underline"
                              >
                                {song.bookLink.anchor}
                              </a>
                            </p>
                          ) : null}
                        </article>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </div>

    </div>
  );
}

function FilterPill({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
        pressed
          ? "bg-[#24455c] text-cream shadow-sm"
          : "border border-[#eadfce] bg-cream text-chestnut-soft hover:text-terracotta"
      }`}
    >
      {children}
    </button>
  );
}

const PlayerHost = memo(function PlayerHost({
  hostRef,
}: {
  hostRef: Ref<HTMLDivElement>;
}) {
  return <div ref={hostRef} className="absolute inset-0" data-player-host="" />;
});

function SingAlongVideo({
  song,
  playing,
  hostRef,
  onPlay,
}: {
  song: Song;
  playing: boolean;
  hostRef: Ref<HTMLDivElement>;
  onPlay: () => void;
}) {
  return (
    <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-2xl bg-chestnut/10">
      <PlayerHost hostRef={hostRef} />
      {playing ? null : (
        <button
          type="button"
          onClick={onPlay}
          className="absolute inset-0 z-10 block h-full w-full"
          aria-label={`Play ${song.title}`}
        >
          <img
            src={`https://i.ytimg.com/vi/${song.videoId}/hqdefault.jpg`}
            alt=""
            width={480}
            height={360}
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-terracotta text-2xl text-cream shadow-lg">
              ▶
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

function NoteBadge({ slug, size = "md" }: { slug: string; size?: "md" | "lg" }) {
  const badge = badgeFor(slug);
  const box = size === "lg" ? "h-12 w-12" : "h-11 w-11";
  return (
    <span
      className={`grid ${box} shrink-0 place-items-center rounded-full`}
      style={{ background: badge.bg, boxShadow: `0 0 0 3px ${badge.ring}` }}
      aria-hidden
    >
      <MusicNote />
    </span>
  );
}

function MusicNote() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden>
      <path d="M9 17.5a2.5 2.5 0 1 1-2-2.45V6.2l10-1.8v8.15a2.5 2.5 0 1 1-2-2.45V7.1l-6 1.1v9.3z" />
    </svg>
  );
}

function PlayArrow() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3 fill-current" aria-hidden>
      <path d="M3 1.5v9l8-4.5-8-4.5z" />
    </svg>
  );
}

function LyricLines({
  song,
  activeLine,
}: {
  song: Extract<Song, { lyricsStatus: "lyrics-ok" }>;
  activeLine: number | null;
}) {
  let lineIndex = -1;
  return (
    <div className="mt-3 max-h-64 space-y-1 overflow-y-auto pr-2 text-[0.98rem] leading-relaxed sm:max-h-80">
      {song.lyrics.map((part, index) => {
        if (part.kind === "label") {
          return (
            <p
              key={`${part.text}-${index}`}
              className="pt-3 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-terracotta"
            >
              {part.text}
            </p>
          );
        }
        lineIndex += 1;
        const currentIndex = lineIndex;
        const tone =
          activeLine == null
            ? "text-chestnut-soft"
            : currentIndex < activeLine
              ? "text-chestnut-soft/40"
              : currentIndex === activeLine
                ? "font-semibold text-chestnut"
                : "text-chestnut-soft/55";
        return (
          <p key={`${part.text}-${index}`} className={`px-1 py-0.5 ${tone}`}>
            {part.text}
          </p>
        );
      })}
    </div>
  );
}
