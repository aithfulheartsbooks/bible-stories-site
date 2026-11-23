export const GA_MEASUREMENT_ID = "G-56F5YQWQE9";
export const INTERNAL_STORAGE_KEY = "fh_internal";
/** Set only by tests. Production pages never assign this. */
export const ANALYTICS_HOST_OVERRIDE = "__FH_ANALYTICS_HOST";
export const AMAZON_CLICK_EVENT = "amazon_click";
export const AMAZON_LINK_SELECTOR =
  'a[href*="amazon.com"], a[href*="amzn.to"], a[href*="link.amazon"]';

const PRODUCTION_HOSTS = ["www.faithfulheartsbooks.com", "faithfulheartsbooks.com"];

export function isProductionAnalyticsHost(hostname: string): boolean {
  return PRODUCTION_HOSTS.includes(hostname);
}

export function resolveAnalyticsHost(hostname: string, override?: string): string {
  if (typeof override === "string" && override.length > 0) return override;
  return hostname;
}

export function isPlayPath(pathname: string): boolean {
  return pathname === "/play" || pathname.startsWith("/play/");
}

export type KeyValueStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

export function syncInternalTraffic(storage: KeyValueStorage, search: string, webdriver: boolean): boolean {
  const query = search.startsWith("?") ? search.slice(1) : search;
  const flag = new URLSearchParams(query).get("fh_internal");
  try {
    if (flag === "1") storage.setItem(INTERNAL_STORAGE_KEY, "1");
    else if (flag === "0") storage.removeItem(INTERNAL_STORAGE_KEY);
  } catch {
    // Storage may be blocked. The URL flag and webdriver still count below.
  }
  let stored: string | null = null;
  try {
    stored = storage.getItem(INTERNAL_STORAGE_KEY);
  } catch {
    stored = null;
  }
  return flag === "1" || webdriver === true || stored === "1";
}

export type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  __FH_ANALYTICS_HOST?: string;
  __fhAnalyticsBooted?: boolean;
};

// Current gtag.js records transport_type as a custom parameter and sends collect
// hits with fetch. Amazon clicks are handed to sendBeacon so the hit survives
// the new tab taking focus.
function sendAmazonClicksWithBeacon(win: AnalyticsWindow) {
  const host = win as AnalyticsWindow & {
    fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
    __fhBeaconFetch?: boolean;
  };
  const beacon = (win.navigator as Navigator).sendBeacon?.bind(win.navigator);
  if (host.__fhBeaconFetch || typeof host.fetch !== "function" || typeof beacon !== "function") return;
  host.__fhBeaconFetch = true;
  const original = host.fetch.bind(host);
  host.fetch = (input, init) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const body = init?.body;
    const bodyText = typeof body === "string" ? body : "";
    if (url.includes("/g/collect") && (url.includes(`en=${AMAZON_CLICK_EVENT}`) || bodyText.includes(`en=${AMAZON_CLICK_EVENT}`))) {
      beacon(url, body instanceof ReadableStream ? undefined : body ?? undefined);
      return Promise.resolve(new Response(null, { status: 204 }));
    }
    return original(input, init);
  };
}

export function bootAnalytics(win: AnalyticsWindow, options: { sendPageView: boolean }): boolean {
  const hostname = resolveAnalyticsHost(win.location.hostname, win.__FH_ANALYTICS_HOST);
  if (!isProductionAnalyticsHost(hostname)) return false;
  if (win.__fhAnalyticsBooted) return true;
  win.__fhAnalyticsBooted = true;
  sendAmazonClicksWithBeacon(win);

  const internal = syncInternalTraffic(win.localStorage, win.location.search, win.navigator.webdriver === true);
  const dataLayer = (win.dataLayer = win.dataLayer || []);
  // gtag.js flushes Arguments objects. An array pushed into dataLayer is ignored.
  const gtag = new Function(
    "dataLayer",
    "return function gtag(){dataLayer.push(arguments);};",
  )(dataLayer) as (...args: unknown[]) => void;
  win.gtag = gtag;
  gtag("js", new Date());
  if (internal) gtag("set", { traffic_type: "internal" });
  if (options.sendPageView) gtag("config", GA_MEASUREMENT_ID);
  else gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });

  const script = win.document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  win.document.head.appendChild(script);

  win.document.addEventListener("click", (event) => {
    const target = event.target as { closest?: (selector: string) => HTMLAnchorElement | null } | null;
    const link = target?.closest?.(AMAZON_LINK_SELECTOR);
    if (!link || typeof win.gtag !== "function") return;
    const params = new URLSearchParams(win.location.search.replace(/^\?/, ""));
    const bookTitle =
      link.closest("article")?.querySelector("h2, h3")?.textContent?.trim() ||
      win.document.querySelector("h1")?.textContent?.trim() ||
      win.document.title;
    win.gtag("event", AMAZON_CLICK_EVENT, {
      book_title: bookTitle,
      link_url: link.href,
      page_path: win.location.pathname,
      page_url: win.location.href,
      referrer_url: win.document.referrer || "",
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      transport_type: "beacon",
    });
  });

  return true;
}
