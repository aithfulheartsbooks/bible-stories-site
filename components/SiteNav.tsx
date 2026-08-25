import { PLAY_IS_LIVE } from "@/lib/play/config";

type SiteNavProps = {
  brandHref?: string;
};

export default function SiteNav({ brandHref = "/" }: SiteNavProps) {
  const linkClass =
    "whitespace-nowrap rounded-full px-2 py-1.5 text-[0.85rem] font-semibold text-chestnut-soft hover:text-terracotta sm:px-3 sm:py-2 sm:text-sm";

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/60 bg-cream/90 px-3 py-2 shadow-sm backdrop-blur-md sm:px-6 sm:py-3">
      <div className="mx-auto flex max-w-[1800px] flex-col items-center gap-1 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-3">
        <a
          href={brandHref}
          className="whitespace-nowrap text-center font-display text-[0.95rem] font-bold text-chestnut sm:text-lg"
        >
          Bible Stories for Little Hearts
        </a>
        <div className="flex flex-wrap items-center justify-center gap-x-0.5 gap-y-0 sm:justify-end">
          <a className={linkClass} href="/">
            Home
          </a>
          <a className={linkClass} href="/tonight">
            Tonight
          </a>
          <a className={linkClass} href="/churches">
            Churches
          </a>
          <a className={linkClass} href="/free-resources">
            Free
          </a>
          {PLAY_IS_LIVE && (
            <a className={linkClass} href="/play">
              Play
            </a>
          )}
          <a className={linkClass} href="/about">
            About
          </a>
        </div>
      </div>
    </nav>
  );
}
