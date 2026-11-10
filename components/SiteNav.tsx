import { PLAY_IS_LIVE } from "@/lib/play/config";

type SiteNavProps = {
  brandHref?: string;
  activeHref?: string;
};

const links: { href: string; label: string; liveOnly?: boolean }[] = [
  { href: "/", label: "Home" },
  { href: "/tonight", label: "Tonight" },
  { href: "/songs", label: "Songs" },
  { href: "/play", label: "Play", liveOnly: true },
  { href: "/free-resources", label: "Free" },
  { href: "/churches", label: "Churches" },
  { href: "/shop", label: "Shop" },
];

export default function SiteNav({ brandHref = "/", activeHref }: SiteNavProps) {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/60 bg-cream/90 px-1.5 py-2 shadow-sm backdrop-blur-md sm:px-6 sm:py-3">
      <div className="mx-auto flex max-w-[1800px] flex-col items-center gap-1 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-3">
        <a
          href={brandHref}
          className="whitespace-nowrap text-center font-display text-[0.95rem] font-bold text-chestnut sm:text-lg"
        >
          Bible Stories for Little Hearts
        </a>
        <div className="flex w-full max-w-full flex-nowrap items-center justify-between gap-0 sm:w-auto sm:justify-end sm:gap-0.5">
          {links
            .filter((link) => !link.liveOnly || PLAY_IS_LIVE)
            .map((link) => {
              const active = activeHref === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap rounded-full px-1 py-1 text-[11px] font-semibold leading-none tracking-tight sm:px-3 sm:py-2 sm:text-sm sm:tracking-normal ${
                    active
                      ? "bg-terracotta text-cream"
                      : "text-chestnut-soft hover:text-terracotta"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
        </div>
      </div>
    </nav>
  );
}
