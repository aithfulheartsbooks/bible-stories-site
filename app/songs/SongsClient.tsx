"use client";

import { useMemo, useState } from "react";
import {
  SONG_GROUPS,
  findSong,
  lyricPlainText,
  songSearchText,
  songs,
  songsInGroup,
  type Song,
  type SongGroupId,
} from "@/lib/songs";

type GroupFilter = "all" | SongGroupId;

const GROUP_DOT: Record<SongGroupId, string> = {
  action: "bg-terracotta",
  gentle: "bg-chestnut",
  story: "bg-gold",
};

const NOTE_STYLE: Record<SongGroupId, string> = {
  action: "bg-terracotta text-cream",
  gentle: "bg-sky text-chestnut",
  story: "bg-gold text-chestnut",
};

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
    setSlug(nextSlug);
    setActiveLine(play ? 0 : null);
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
              <span
                className={`mt-0.5 grid h-12 w-12 shrink-0 place-items-center rounded-full text-lg ${NOTE_STYLE[current.group]}`}
                aria-hidden
              >
                ♪
              </span>
              <div>
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
            <p className="mt-3 rounded-2xl bg-cream-deep/80 px-3 py-2 text-sm text-chestnut-soft">
              <span aria-hidden>💡 </span>
              {current.tip}
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
              <LyricLines
                song={current}
                activeLine={videoOn ? activeLine : null}
                onPick={setActiveLine}
              />
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
            const total = songsInGroup(group.id).length;
            return (
              <section key={group.id} className="mt-6" aria-labelledby={`group-${group.id}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${GROUP_DOT[group.id]}`} aria-hidden />
                  <h2 id={`group-${group.id}`} className="font-display text-2xl font-bold text-chestnut">
                    {group.title}
                  </h2>
                  <span className="rounded-full bg-cream px-2.5 py-0.5 text-xs font-semibold text-chestnut-soft shadow-sm">
                    {total} songs
                  </span>
                </div>
                <p className="mt-1 text-sm text-chestnut-soft">{group.blurb}</p>
                <ul className="mt-3 space-y-3">
                  {inGroup.map((song) => {
                    const selected = song.slug === current.slug;
                    return (
                      <li key={song.slug}>
                        <article
                          className={`rounded-3xl border bg-cream p-3 shadow-sm transition ${
                            selected ? "border-terracotta shadow-md" : "border-white/80"
                          }`}
                          data-song={song.slug}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => choose(song.slug, true)}
                              className="flex min-w-0 flex-1 items-center gap-3 text-left"
                            >
                              <span
                                className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-lg ${NOTE_STYLE[song.group]}`}
                                aria-hidden
                              >
                                ♪
                              </span>
                              <span className="min-w-0">
                                <span className="block font-display text-lg font-bold leading-tight text-chestnut">
                                  {song.title}
                                </span>
                                <span className="mt-0.5 block text-sm text-chestnut-soft">{song.tip}</span>
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => choose(song.slug, true)}
                              className="shrink-0 rounded-full border border-terracotta/30 px-3 py-1.5 text-sm font-semibold text-terracotta transition hover:bg-terracotta hover:text-cream"
                            >
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
      className={`rounded-full px-3 py-1.5 text-sm font-semibold shadow-sm transition ${
        pressed ? "bg-chestnut text-cream" : "border border-white/80 bg-cream text-chestnut-soft hover:text-terracotta"
      }`}
    >
      {children}
    </button>
  );
}

function SingAlongVideo({
  song,
  playing,
  onPlay,
}: {
  song: Song;
  playing: boolean;
  onPlay: () => void;
}) {
  return (
    <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-2xl bg-chestnut/10">
      {playing ? (
        <iframe
          key={song.videoId}
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${song.videoId}?autoplay=1&rel=0`}
          title={`${song.title} sing-along video`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={onPlay} className="absolute inset-0 block h-full w-full">
          <img
            src={`https://i.ytimg.com/vi/${song.videoId}/hqdefault.jpg`}
            alt={`Play ${song.title}, a children's sing-along video`}
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

function LyricLines({
  song,
  activeLine,
  onPick,
}: {
  song: Extract<Song, { lyricsStatus: "lyrics-ok" }>;
  activeLine: number | null;
  onPick?: (line: number) => void;
}) {
  let lineIndex = -1;
  return (
    <div className="mt-3 space-y-1 text-[0.98rem] leading-relaxed text-chestnut-soft">
      {song.lyrics.map((part, index) => {
        if (part.kind === "label") {
          return (
            <p key={`${part.text}-${index}`} className="pt-2 text-xs font-bold uppercase tracking-[0.16em] text-terracotta">
              {part.text}
            </p>
          );
        }
        lineIndex += 1;
        const currentIndex = lineIndex;
        const highlighted = activeLine === currentIndex;
        if (!onPick) {
          return (
            <p key={`${part.text}-${index}`} className="px-2 py-0.5">
              {part.text}
            </p>
          );
        }
        return (
          <button
            key={`${part.text}-${index}`}
            type="button"
            onClick={() => onPick(currentIndex)}
            className={`block w-full rounded-lg px-2 py-0.5 text-left transition ${
              highlighted ? "bg-terracotta/15 font-semibold text-chestnut" : "hover:bg-cream-deep"
            }`}
            aria-pressed={highlighted}
          >
            {part.text}
          </button>
        );
      })}
    </div>
  );
}
