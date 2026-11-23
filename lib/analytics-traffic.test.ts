import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  AMAZON_CLICK_EVENT,
  AMAZON_LINK_SELECTOR,
  ANALYTICS_HOST_OVERRIDE,
  GA_MEASUREMENT_ID,
  INTERNAL_STORAGE_KEY,
  bootAnalytics,
  isPlayPath,
  isProductionAnalyticsHost,
  resolveAnalyticsHost,
  syncInternalTraffic,
  type AnalyticsWindow,
  type KeyValueStorage,
} from "@/lib/analytics-traffic";

function memoryStorage(initial: Record<string, string> = {}): KeyValueStorage & { snapshot(): Record<string, string> } {
  const data = { ...initial };
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null;
    },
    setItem(key, value) {
      data[key] = value;
    },
    removeItem(key) {
      delete data[key];
    },
    snapshot() {
      return { ...data };
    },
  };
}

test("internal traffic follows webdriver, the URL flag, and stored fh_internal", () => {
  const fresh = memoryStorage();
  assert.equal(syncInternalTraffic(fresh, "", false), false);
  assert.deepEqual(fresh.snapshot(), {});

  const automated = memoryStorage();
  assert.equal(syncInternalTraffic(automated, "", true), true);
  assert.deepEqual(automated.snapshot(), {});

  const flagged = memoryStorage();
  assert.equal(syncInternalTraffic(flagged, "?fh_internal=1&utm_source=newsletter", false), true);
  assert.equal(flagged.snapshot()[INTERNAL_STORAGE_KEY], "1");

  const remembered = memoryStorage({ [INTERNAL_STORAGE_KEY]: "1" });
  assert.equal(syncInternalTraffic(remembered, "", false), true);
  assert.equal(remembered.snapshot()[INTERNAL_STORAGE_KEY], "1");

  const cleared = memoryStorage({ [INTERNAL_STORAGE_KEY]: "1" });
  assert.equal(syncInternalTraffic(cleared, "?fh_internal=0", false), false);
  assert.equal(cleared.snapshot()[INTERNAL_STORAGE_KEY], undefined);

  const clearedBot = memoryStorage({ [INTERNAL_STORAGE_KEY]: "1" });
  assert.equal(syncInternalTraffic(clearedBot, "?fh_internal=0", true), true);
  assert.equal(clearedBot.snapshot()[INTERNAL_STORAGE_KEY], undefined);
});

test("analytics loads only on the production hosts", () => {
  assert.equal(isProductionAnalyticsHost("www.faithfulheartsbooks.com"), true);
  assert.equal(isProductionAnalyticsHost("faithfulheartsbooks.com"), true);
  for (const host of ["localhost", "127.0.0.1", "bible-stories-site.vercel.app", "preview.faithfulheartsbooks.com", ""]) {
    assert.equal(isProductionAnalyticsHost(host), false, host);
  }
  assert.equal(resolveAnalyticsHost("localhost", undefined), "localhost");
  assert.equal(resolveAnalyticsHost("localhost", ""), "localhost");
  assert.equal(resolveAnalyticsHost("localhost", "www.faithfulheartsbooks.com"), "www.faithfulheartsbooks.com");
});

test("play paths suppress the page view and still install the amazon listener", () => {
  assert.equal(isPlayPath("/play"), true);
  assert.equal(isPlayPath("/play/"), true);
  assert.equal(isPlayPath("/play/album"), true);
  assert.equal(isPlayPath("/playground"), false);
  assert.equal(isPlayPath("/"), false);

  const play = fakeWindow({ hostname: "www.faithfulheartsbooks.com", pathname: "/play", webdriver: true });
  assert.equal(bootAnalytics(play.win, { sendPageView: false }), true);
  assert.equal(play.listeners.length, 1);
  assert.equal(play.scripts.length, 1);
  assert.match(play.scripts[0], new RegExp(GA_MEASUREMENT_ID));

  const commands = play.win.dataLayer!.map((entry) => Array.from(entry as ArrayLike<unknown>));
  const setAt = commands.findIndex((entry) => entry[0] === "set");
  const configAt = commands.findIndex((entry) => entry[0] === "config");
  assert.ok(setAt >= 0 && setAt < configAt);
  assert.deepEqual(commands[setAt], ["set", { traffic_type: "internal" }]);
  assert.deepEqual(commands[configAt], ["config", GA_MEASUREMENT_ID, { send_page_view: false }]);

  play.listeners[0]({
    target: {
      closest: () => ({
        href: "https://www.amazon.com/dp/B0H1CG1P1X",
        closest: () => ({ querySelector: () => ({ textContent: "Zacchaeus" }) }),
      }),
    },
  });
  const click = Array.from(play.win.dataLayer!.at(-1) as ArrayLike<unknown>);
  assert.equal(click[0], "event");
  assert.equal(click[1], AMAZON_CLICK_EVENT);
  assert.equal((click[2] as { transport_type: string }).transport_type, "beacon");
  assert.match(AMAZON_LINK_SELECTOR, /amazon\.com/);
  assert.match(AMAZON_LINK_SELECTOR, /amzn\.to/);
  assert.match(AMAZON_LINK_SELECTOR, /link\.amazon/);

  assert.equal(bootAnalytics(play.win, { sendPageView: false }), true);
  assert.equal(play.listeners.length, 1);
});

test("a non-production host never loads the tag, unless a test overrides the host", () => {
  const local = fakeWindow({ hostname: "localhost" });
  assert.equal(bootAnalytics(local.win, { sendPageView: true }), false);
  assert.equal(local.listeners.length, 0);
  assert.equal(local.scripts.length, 0);

  const overridden = fakeWindow({ hostname: "localhost", override: "faithfulheartsbooks.com" });
  assert.equal(bootAnalytics(overridden.win, { sendPageView: true }), true);
  assert.equal(overridden.listeners.length, 1);
  assert.equal(overridden.win[ANALYTICS_HOST_OVERRIDE], "faithfulheartsbooks.com");
  const config = overridden.win.dataLayer!
    .map((entry) => Array.from(entry as ArrayLike<unknown>))
    .find((entry) => entry[0] === "config");
  assert.deepEqual(config, ["config", GA_MEASUREMENT_ID]);
});

test("the page mounts the shared boot on every route, including /play", () => {
  const source = fs.readFileSync(path.join(process.cwd(), "components/AnalyticsScripts.tsx"), "utf8");
  const moduleSource = fs.readFileSync(path.join(process.cwd(), "lib/analytics-traffic.ts"), "utf8");
  assert.match(source, /bootAnalytics\(window, \{ sendPageView: !isPlayPath\(pathname\) \}\)/);
  assert.doesNotMatch(source, /showAnalytics|gtag\(|amazon_click/);
  assert.match(moduleSource, /transport_type: "beacon"/);
  assert.match(moduleSource, /addEventListener\("click"/);
  assert.equal(moduleSource.match(/transport_type: "beacon"/g)?.length, 1);
});

function fakeWindow(options: {
  hostname: string;
  pathname?: string;
  search?: string;
  webdriver?: boolean;
  override?: string;
}) {
  const listeners: Array<(event: { target: { closest: (selector: string) => unknown } | null }) => void> = [];
  const scripts: string[] = [];
  const win = {
    location: {
      hostname: options.hostname,
      search: options.search || "",
      pathname: options.pathname || "/",
      href: `https://${options.hostname}${options.pathname || "/"}`,
    },
    navigator: { webdriver: options.webdriver === true },
    localStorage: memoryStorage(),
    document: {
      title: "Bible Stories",
      referrer: "",
      head: {
        appendChild(node: { src?: string }) {
          if (node.src) scripts.push(node.src);
        },
      },
      createElement() {
        return { async: false, src: "" };
      },
      addEventListener(_type: string, listener: (event: { target: { closest: (selector: string) => unknown } | null }) => void) {
        listeners.push(listener);
      },
      querySelector() {
        return { textContent: "Page heading" };
      },
    },
    __FH_ANALYTICS_HOST: options.override,
  } as unknown as AnalyticsWindow;
  return { win, listeners, scripts };
}
