import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import TonightClient from "./TonightClient";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Tonight's Story | Bible Stories for Little Hearts",
  description:
    "A new Bible picture book every night for ages 3–8. Read a few story pages, then buy the paperback on Amazon.",
  alternates: { canonical: "/tonight" },
};

export default function TonightPage() {
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

      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-8 pt-32 text-center">
        <span className="mb-4 inline-block rounded-full border border-terracotta/20 bg-white/55 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta backdrop-blur-sm">
          A new book every night
        </span>
        <h1 className="font-display text-4xl font-extrabold text-chestnut sm:text-5xl">
          Tonight's story
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-display text-lg italic text-chestnut-soft">
          Open this page at bedtime and a picture book is already waiting. It
          changes at midnight. Buy the paperback on Amazon.
        </p>
      </section>

      <div className="relative z-10">
        <TonightClient />
      </div>

      <SiteFooter />
    </main>
  );
}
