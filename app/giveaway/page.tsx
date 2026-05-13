import SiteNav from "@/components/SiteNav";
import GiveawayCountdown from "@/components/GiveawayCountdown";

export const metadata = {
  title: "Monthly Book Giveaway | Bible Stories for Little Hearts",
  description:
    "Enter to win a free book from Bible Stories for Little Hearts! One winner is drawn on the 1st of every month.",
  alternates: {
    canonical: "/giveaway",
  },
};

const STEPS = [
  {
    number: "1",
    title: "Enter your email",
    description:
      "Drop your email in the form below. One entry per person per month.",
  },
  {
    number: "2",
    title: "We draw on the 1st",
    description:
      "Every month on the 1st we randomly pick one winner from all entries.",
  },
  {
    number: "3",
    title: "You pick your book",
    description:
      "The winner gets to choose any title from the Bible Stories for Little Hearts series — we ship it free.",
  },
];

export default function GiveawayPage() {
  return (
    <main className="relative min-h-screen overflow-hidden font-body text-chestnut">
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

      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-24 text-center sm:pt-28">

        {/* ── Hero ── */}
        <div className="opacity-0 animate-fade-up">
          <span className="mb-6 inline-block rounded-full border border-terracotta/20 bg-white/55 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta backdrop-blur-sm">
            Monthly Giveaway
          </span>

          <h1 className="mb-4 font-display text-5xl font-extrabold leading-tight text-chestnut sm:text-6xl">
            Win a Free Book!
          </h1>

          <p className="mx-auto max-w-xl text-lg leading-relaxed text-chestnut-soft sm:text-xl">
            Every month we give away one book from the{" "}
            <em>Bible Stories for Little Hearts</em> series. The winner picks
            whichever title they love most — and we ship it right to their door.
          </p>

          <div className="mt-6 text-xl tracking-widest text-gold">
            {"✦ ✦ ✦"}
          </div>
        </div>

        {/* ── Countdown ── */}
        <div
          className="opacity-0 animate-fade-up mt-12"
          style={{ animationDelay: "0.1s" }}
        >
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-terracotta">
            Next drawing in
          </p>
          <GiveawayCountdown />
        </div>

        {/* ── How it works ── */}
        <div
          className="opacity-0 animate-fade-up mt-16"
          style={{ animationDelay: "0.18s" }}
        >
          <h2 className="mb-8 font-display text-3xl font-bold text-chestnut">
            How it works
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="rounded-3xl border border-white/80 bg-cream/85 p-6 shadow-md backdrop-blur-md text-left"
              >
                <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-terracotta font-display text-lg font-extrabold text-cream shadow-sm">
                  {step.number}
                </span>
                <h3 className="mb-2 font-display text-xl font-bold text-chestnut">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-chestnut-soft">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Entry form ── */}
        <div
          className="opacity-0 animate-fade-up mt-16"
          style={{ animationDelay: "0.26s" }}
        >
          <div className="rounded-3xl border border-white/80 bg-cream/85 p-8 shadow-md backdrop-blur-md">
            <h2 className="mb-2 font-display text-3xl font-bold text-chestnut">
              Enter this month&apos;s giveaway
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-chestnut-soft">
              One entry per person. Winners are notified by email on the 1st of
              each month.
            </p>

            {/*
              ─────────────────────────────────────────────
              KIT FORM EMBED — paste your Kit embed code
              in place of the placeholder below.

              In Kit: Forms → your form → Embed → Inline
              Copy the HTML snippet and replace everything
              between the two comment lines.
              ─────────────────────────────────────────────
            */}
            <div className="rounded-2xl border-2 border-dashed border-terracotta/30 bg-white/50 p-8 text-center">
              <p className="text-sm font-semibold text-chestnut-soft">
                📋 Kit form embed goes here
              </p>
              <p className="mt-2 text-xs text-chestnut-soft/70">
                In Kit → Forms → your form → Embed → Inline, then paste the
                HTML here.
              </p>
            </div>
            {/* ── END KIT EMBED ── */}
          </div>
        </div>

        {/* ── Rules ── */}
        <div
          className="opacity-0 animate-fade-up mt-10 rounded-3xl border border-white/80 bg-white/40 p-6 text-left text-xs leading-relaxed text-chestnut-soft/70 backdrop-blur-md shadow-sm"
          style={{ animationDelay: "0.34s" }}
        >
          <p className="font-bold mb-1 text-chestnut-soft">Giveaway rules</p>
          <p>
            Open to residents of the United States. One entry per person per
            month. Winner is selected at random on the 1st of each month and
            notified by email. The winner has 7 days to respond before a new
            winner is drawn. No purchase necessary. Void where prohibited.
          </p>
        </div>

        <a
          href="/free-resources"
          className="mt-10 inline-flex rounded-full bg-white/70 px-5 py-2.5 text-sm font-semibold text-chestnut-soft shadow-sm backdrop-blur transition hover:bg-white hover:text-terracotta"
        >
          ← Free Resources
        </a>
      </section>
    </main>
  );
}
