import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import ChurchesClient from "./ChurchesClient";

export const metadata: Metadata = {
  title: "This Week's Sunday School Kit | Bible Stories for Little Hearts",
  description:
    "A new picture-book kit every week for Sunday school and homeschool. Order the paperbacks on Amazon.",
  alternates: { canonical: "/churches" },
};

export default function ChurchesPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden font-body text-chestnut">
      <div className="scenery" />
      <div className="cloud animate-drift-slow h-[60px] w-[180px] top-[8%] left-[-200px]" />
      <div
        className="cloud animate-drift-long h-[45px] w-[140px] top-[18%] left-[-200px]"
        style={{ animationDelay: "-30s" }}
      />

      <SiteNav />

      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-8 pt-32 text-center">
        <span className="mb-4 inline-block rounded-full border border-terracotta/20 bg-white/55 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta backdrop-blur-sm">
          Sunday school · homeschool
        </span>
        <h1 className="font-display text-4xl font-extrabold text-chestnut sm:text-5xl">
          This week's kit
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-display text-lg italic text-chestnut-soft">
          A new classroom theme every Sunday. Three stories, then buy the
          paperbacks on Amazon.
        </p>
      </section>

      <div className="relative z-10">
        <ChurchesClient />
      </div>

      <SiteFooter />
    </main>
  );
}
