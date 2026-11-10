import type { Metadata } from "next";
import Image from "next/image";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { findSong, songs, type Song } from "@/lib/songs";
import SongsClient from "./SongsClient";

const title = "Kids Church Songs with Actions & Lyrics | Faith Rivers";
const description =
  "Sing-along Sunday school songs for ages 3-8, with videos and lyrics. Action songs, gentle bedtime songs and Bible story songs to share at home or church.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/songs" },
  openGraph: {
    title,
    description,
    url: "/songs",
    type: "website",
    siteName: "Bible Stories for Little Hearts",
    images: [
      {
        url: "/art/songs-kids-singing.webp",
        width: 1920,
        height: 1280,
        alt: "Watercolor illustration of young children singing together on a grassy hill, one playing a guitar, with a small white church in the distance.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/art/songs-kids-singing.webp"],
  },
};

function SongWords({ song }: { song: Song }) {
  return (
    <article className="rounded-3xl border border-white/80 bg-cream/90 p-4 shadow-sm">
      <h3 className="font-display text-lg font-bold text-chestnut">{song.title}</h3>
      <p className="text-sm text-chestnut-soft">{song.tip}</p>
      {song.bookLink ? (
        <p className="mt-1 text-sm">
          <a href={song.bookLink.href} className="font-semibold text-terracotta underline-offset-2 hover:underline">
            {song.bookLink.anchor}
          </a>
        </p>
      ) : null}
      {song.lyricsStatus === "lyrics-ok" ? (
        <div className="mt-2 space-y-1 text-sm leading-relaxed text-chestnut-soft">
          {song.lyrics.map((part, index) =>
            part.kind === "label" ? (
              <p key={`${part.text}-${index}`} className="pt-2 text-xs font-bold uppercase tracking-[0.16em] text-terracotta">
                {part.text}
              </p>
            ) : (
              <p key={`${part.text}-${index}`}>{part.text}</p>
            ),
          )}
        </div>
      ) : (
        <p className="mt-2 text-sm text-chestnut-soft">Sing along with the video.</p>
      )}
    </article>
  );
}

const pillClass =
  "inline-flex items-center justify-center rounded-full border border-terracotta/25 bg-cream/80 px-5 py-2.5 text-sm font-semibold text-chestnut-soft shadow-sm transition hover:border-terracotta hover:bg-terracotta hover:text-cream";

export default function SongsPage({
  searchParams,
}: {
  searchParams?: { song?: string | string[] };
}) {
  const raw = searchParams?.song;
  const requested = Array.isArray(raw) ? raw[0] : raw;
  const initialSlug = findSong(requested).slug;

  return (
    <main className="relative min-h-screen overflow-x-hidden font-body text-chestnut">
      <div className="scenery" />
      <div className="cloud animate-drift-slow h-[60px] w-[180px] top-[8%] left-[-200px]" />
      <div
        className="cloud animate-drift-long h-[45px] w-[140px] top-[18%] left-[-200px]"
        style={{ animationDelay: "-30s" }}
      />
      <div
        className="cloud animate-drift-medium h-[70px] w-[220px] top-[4%] left-[-200px]"
        style={{ animationDelay: "-60s" }}
      />

      <SiteNav />

      <header className="relative z-10 mx-auto max-w-3xl px-4 pb-6 pt-28 text-center sm:px-6 sm:pt-32">
        <span className="mb-4 inline-block max-w-full whitespace-nowrap rounded-full border border-terracotta/20 bg-white/55 px-3 py-2 text-[0.58rem] font-semibold uppercase tracking-[0.08em] text-terracotta backdrop-blur-sm sm:px-5 sm:text-xs sm:tracking-[0.22em]">
          Sing-along songs for little hearts
        </span>
        <h1 className="font-display text-4xl font-extrabold leading-tight text-chestnut sm:text-6xl">
          Kids Church Songs to Sing Together
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-display text-lg italic leading-relaxed text-chestnut-soft sm:text-xl">
          The songs children sing in church — tap one, sing along together, and follow the words as they play.
        </p>
        <div className="relative mx-auto mt-8 w-full overflow-hidden rounded-3xl border border-white/80 shadow-md">
          <Image
            src="/art/songs-kids-singing.webp"
            alt="Watercolor illustration of young children singing together on a grassy hill, one playing a guitar, with a small white church in the distance."
            width={1920}
            height={1280}
            priority
            sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 768px) calc(100vw - 3rem), 720px"
            className="h-44 w-full object-cover object-[center_58%] sm:h-auto"
          />
        </div>
        <p className="mx-auto mt-4 max-w-xl text-sm text-chestnut-soft">
          Made for bedtime, car rides, and Sunday school. Tap a song and sing along together.
        </p>
      </header>

      <SongsClient initialSlug={initialSlug} />

      <section className="relative z-10 mx-auto mt-10 max-w-3xl px-4 pb-4 sm:px-6" aria-labelledby="all-words-heading">
        <h2 id="all-words-heading" className="text-center font-display text-2xl font-bold text-chestnut">
          Words to sing along
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-chestnut-soft">
          Words we can share are printed with the song. For every other song, sing along with the video.
        </p>
        <div className="mt-4 space-y-4">
          {songs.map((song) => (
            <SongWords key={song.slug} song={song} />
          ))}
        </div>
      </section>

      <SiteFooter
        extra={
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a className={pillClass} href="/tonight">
              Tonight&apos;s story
            </a>
            <a className={pillClass} href="/book/zacchaeus">
              Read the Zacchaeus story
            </a>
            <a className={pillClass} href="/book/noah-and-gods-big-promise">
              Read the Noah and God&apos;s Big Promise story
            </a>
            <a className={pillClass} href="/">
              Read all the Bible stories
            </a>
          </div>
        }
      />
    </main>
  );
}
