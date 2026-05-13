type SiteNavProps = {
  brandHref?: string;
};

export default function SiteNav({ brandHref = "/#top" }: SiteNavProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/60 bg-cream/85 px-4 py-3 shadow-sm backdrop-blur-md sm:px-6">
      <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-center gap-3 sm:justify-between">
        <a
          href={brandHref}
          className="text-center font-display text-base font-bold text-chestnut sm:text-lg"
        >
          Bible Stories for Little Hearts
        </a>
        <div className="flex items-center gap-2 text-sm font-semibold text-chestnut-soft sm:gap-4">
          <a className="rounded-full px-3 py-2 hover:text-terracotta" href="/#books">
            Books
          </a>
          <a
            className="rounded-full px-3 py-2 hover:text-terracotta"
            href="/#series-map"
          >
            Series Map
          </a>
          <a className="rounded-full px-3 py-2 hover:text-terracotta" href="/about">
            About
          </a>
          <a
            className="rounded-full px-3 py-2 hover:text-terracotta"
            href="/free-resources"
          >
            Free Resources
          </a>
        </div>
      </div>
    </nav>
  );
}
