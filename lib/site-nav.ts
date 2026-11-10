import { PLAY_IS_LIVE } from "@/lib/play/config";

export type SiteNavMatch = "exact" | "prefix";

export type SiteNavItem = {
  href: string;
  label: string;
  match: SiteNavMatch;
  liveOnly?: boolean;
};

/** Single menu definition. Active state is derived from the pathname, not from each page. */
export const siteNavItems: readonly SiteNavItem[] = [
  { href: "/", label: "Home", match: "exact" },
  { href: "/tonight", label: "Tonight", match: "prefix" },
  { href: "/songs", label: "Songs", match: "prefix" },
  { href: "/play", label: "Play", match: "prefix", liveOnly: true },
  { href: "/free-resources", label: "Free", match: "prefix" },
  { href: "/churches", label: "Churches", match: "prefix" },
  { href: "/shop", label: "Shop", match: "prefix" },
];

export type SiteNavLinkState = {
  href: string;
  label: string;
  active: boolean;
};

export function normalizePathname(pathname: string): string {
  const path = pathname.split("#")[0]?.split("?")[0] ?? "";
  if (path === "") return "";
  if (path === "/") return "/";
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  return withSlash.length > 1 && withSlash.endsWith("/") ? withSlash.slice(0, -1) : withSlash;
}

export function activeSiteNavItem(pathname: string): SiteNavItem | null {
  const path = normalizePathname(pathname);
  for (const item of siteNavItems) {
    if (item.match === "exact") {
      if (path === item.href) return item;
    } else if (path === item.href || path.startsWith(`${item.href}/`)) {
      return item;
    }
  }
  return null;
}

/** Links actually rendered, with the active item chosen from the current pathname. */
export function siteNavLinkState(pathname: string): SiteNavLinkState[] {
  const activeHref = activeSiteNavItem(pathname)?.href ?? null;
  return siteNavItems
    .filter((item) => !item.liveOnly || PLAY_IS_LIVE)
    .map((item) => ({
      href: item.href,
      label: item.label,
      active: item.href === activeHref,
    }));
}
