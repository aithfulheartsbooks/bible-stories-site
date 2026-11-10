"use client";

import { usePathname } from "next/navigation";
import { siteNavLinkState } from "@/lib/site-nav";

type SiteNavProps = {
  brandHref?: string;
};

export default function SiteNav({ brandHref = "/" }: SiteNavProps) {
  const pathname = usePathname() ?? "";
  const links = siteNavLinkState(pathname);

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
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.active ? "page" : undefined}
              className={`whitespace-nowrap rounded-full px-1 py-1 text-[11px] font-semibold leading-none tracking-tight sm:px-3 sm:py-2 sm:text-sm sm:tracking-normal ${
                link.active
                  ? "bg-terracotta text-cream"
                  : "text-chestnut-soft hover:text-terracotta"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
