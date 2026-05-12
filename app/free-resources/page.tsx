import SiteNav from "@/components/SiteNav";

const resources = [
  {
    title: "Bible Stories Reading Tracker",
    type: "Reading Tracker",
    description:
      "A gentle checklist to help little hearts follow along as the series grows.",
    href: "/resources/bible-stories-reading-tracker.pdf",
  },
  {
    title: "Bible Verse Cards for Little Hearts",
    type: "Verse Cards",
    description:
      "Simple printable cards for bedtime, story time, memory practice, or encouragement.",
    href: "/resources/bible-verse-cards-for-little-hearts.pdf",
  },
  {
    title: "The Lost Sheep Coloring Page",
    type: "Coloring Page",
    description:
      "A peaceful printable coloring page made from The Lost Sheep artwork.",
    href: "/resources/the-lost-sheep-coloring-page.pdf",
  },
];

export const metadata = {
  title: "Free Resources | Bible Stories for Little Hearts",
  description:
    "Free printable Bible story resources for children from Bible Stories for Little Hearts.",
  alternates: {
    canonical: "/free-resources",
  },
};

export default function FreeResourcesPage() {
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

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-24 text-center sm:pt-28">
        <div className="opacity-0 animate-fade-up mx-auto max-w-3xl">
          <span className="mb-6 inline-block rounded-full border border-terracotta/20 bg-white/55 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta backdrop-blur-sm">
            Free Printables
          </span>

          <h1 className="mb-4 font-display text-5xl font-extrabold leading-tight text-chestnut sm:text-6xl">
            Free Resources
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-chestnut-soft sm:text-xl">
            Gentle Bible story printables for reading time, quiet moments, and
            little hearts learning God&apos;s Word.
          </p>

          <div className="mt-6 text-xl tracking-widest text-gold">
            {"\u2726 \u2726 \u2726"}
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {resources.map((resource, index) => (
            <article
              key={resource.title}
              className="opacity-0 animate-fade-up flex h-full flex-col rounded-3xl border border-white/80 bg-cream/85 p-7 text-left shadow-md backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ animationDelay: `${0.12 + index * 0.1}s` }}
            >
              <span className="mb-5 w-fit rounded-full border border-gold/40 bg-white/60 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-terracotta">
                {resource.type}
              </span>
              <h2 className="font-display text-2xl font-bold leading-tight text-chestnut">
                {resource.title}
              </h2>
              <p className="mt-4 flex-1 text-base leading-relaxed text-chestnut-soft">
                {resource.description}
              </p>
              <a
                href={resource.href}
                download
                className="mt-7 inline-flex items-center justify-center rounded-full bg-terracotta px-5 py-3 text-sm font-bold text-cream shadow-sm transition hover:bg-chestnut"
              >
                Download PDF
              </a>
            </article>
          ))}
        </div>

        <div
          className="opacity-0 animate-fade-up mx-auto mt-12 max-w-2xl rounded-3xl border border-white/80 bg-white/55 p-6 shadow-sm backdrop-blur-md"
          style={{ animationDelay: "0.45s" }}
        >
          <h2 className="font-display text-2xl font-bold text-chestnut">
            More coming soon
          </h2>
          <p className="mt-3 text-base leading-relaxed text-chestnut-soft">
            As new books join the collection, this page can grow with coloring
            pages, verse cards, reading guides, and simple family activities.
          </p>
        </div>

        <a
          href="/"
          className="mt-10 inline-flex rounded-full bg-white/70 px-5 py-2.5 text-sm font-semibold text-chestnut-soft shadow-sm backdrop-blur transition hover:bg-white hover:text-terracotta"
        >
          &larr; Back to Books
        </a>
      </section>
    </main>
  );
}
