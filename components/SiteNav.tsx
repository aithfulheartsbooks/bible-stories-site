"use client";

import { useState } from "react";
import { PLAY_IS_LIVE } from "@/lib/play/config";

type SiteNavProps = {
  brandHref?: string;
};

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/#books", label: "Books" },
  { href: "/tonight", label: "Tonight" },
  { href: "/churches", label: "Churches" },
  { href: "/free-resources", label: "Free Resources" },
  ...(PLAY_IS_LIVE ? [{ href: "/play", label: "Play" }] : []),
  { href: "/about", label: "About" },
];

export default function SiteNav({ brandHref = "/" }: SiteNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/60 bg-cream/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-3 px-4 py-2 sm:px-6 sm:py-3">
        <a
          href={brandHref}
          className="whitespace-nowrap font-display text-[0.95rem] font-bold text-chestnut sm:text-lg"
        >
          Bible Stories for Little Hearts
        </a>

        <div className="hidden items-center gap-1 text-sm font-semibold text-chestnut-soft lg:flex lg:gap-3">
          {LINKS.map((link) => (
            <a
              key={link.href + link.label}
              className="whitespace-nowrap rounded-full px-3 py-2 hover:text-terracotta"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-terracotta/25 bg-cream text-chestnut lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span className="flex flex-col items-center justify-center gap-1.5">
            <span className={`block h-0.5 w-4 rounded bg-chestnut transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-4 rounded bg-chestnut transition ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-4 rounded bg-chestnut transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/70 bg-cream/95 px-4 py-3 lg:hidden">
          <div className="mx-auto flex max-w-[1800px] flex-col">
            {LINKS.map((link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                className="rounded-2xl px-3 py-3 font-semibold text-chestnut-soft hover:bg-cream-deep hover:text-terracotta"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
