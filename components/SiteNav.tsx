import { PLAY_IS_LIVE } from "@/lib/play/config";

type SiteNavProps = {
  brandHref?: string;
};

export default function SiteNav({ brandHref = "/" }: SiteNavProps) {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/60 bg-cream/90 px-4 py-2 shadow-sm backdrop-blur-md sm:px-6 sm:py-3">
      <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-center gap-2 sm:gap-3 sm:justify-between">
        <a
          href={brandHref}
          className="whitespace-nowrap text-center font-display text-[0.95rem] font-bold text-chestnut sm:text-lg"
        >
          Bible Stories for Little Hearts
        </a>
        <div className="flex items-center gap-1 text-[0.92rem] font-semibold text-chestnut-soft sm:gap-4 sm:text-sm">
          <a className="whitespace-nowrap rounded-full px-2.5 py-1.5 hover:text-terracotta sm:px-3 sm:py-2" href="/">
            Home
          </a>
          <a className="whitespace-nowrap rounded-full px-2.5 py-1.5 hover:text-terracotta sm:px-3 sm:py-2" href="/#books">
            Books
          </a>
          <a
            className="whitespace-nowrap rounded-full px-2.5 py-1.5 hover:text-terracotta sm:px-3 sm:py-2"
            href="/free-resources"
          >
            Free Resources
          </a>
          {PLAY_IS_LIVE && (
            <a
              className="whitespace-nowrap rounded-full px-2.5 py-1.5 hover:text-terracotta sm:px-3 sm:py-2"
              href="/play"
            >
              Play
            </a>
          )}
          <a className="whitespace-nowrap rounded-full px-2.5 py-1.5 hover:text-terracotta sm:px-3 sm:py-2" href="/about">
            About
          </a>
        </div>
      </div>
    </nav>
  );
}
