import { chromium, devices } from "playwright-core";

const base = process.env.SONGS_BASE_URL ?? "http://127.0.0.1:3456";
const chrome = process.env.CHROME_PATH ?? "/usr/bin/google-chrome";

const songs = [
  { slug: "this-little-light-of-mine", via: "/songs" },
  { slug: "the-b-i-b-l-e", via: "/songs" },
  { slug: "jesus-loves-the-little-children", via: "/songs?song=jesus-loves-the-little-children" },
];

function stub() {
  window.__clickDepth = 0;
  window.__playLog = [];
  document.addEventListener(
    "click",
    () => {
      window.__clickDepth = 1;
      window.setTimeout(() => {
        window.__clickDepth = 0;
      }, 0);
    },
    true,
  );
  window.YT = {
    Player: function (element, options) {
      const player = {
        state: -1,
        videoId: options.videoId ?? "",
        getPlayerState() {
          return this.state;
        },
        getCurrentTime() {
          return 1;
        },
        playVideo() {
          window.__playLog.push({ method: "playVideo", duringClick: window.__clickDepth > 0 });
          this.state = 1;
          options.events?.onStateChange?.({ data: 1, target: this });
        },
        pauseVideo() {
          window.__playLog.push({ method: "pauseVideo", duringClick: window.__clickDepth > 0 });
          this.state = 2;
          options.events?.onStateChange?.({ data: 2, target: this });
        },
        loadVideoById(id) {
          window.__playLog.push({ method: "loadVideoById", id, duringClick: window.__clickDepth > 0 });
          this.videoId = id;
          this.state = 1;
          options.events?.onStateChange?.({ data: 1, target: this });
        },
        cueVideoById(id) {
          window.__playLog.push({ method: "cueVideoById", id, duringClick: window.__clickDepth > 0 });
          this.videoId = id;
          this.state = 5;
        },
      };
      window.__singAlong = player;
      const iframe = document.createElement("iframe");
      iframe.setAttribute("data-stub-player", "1");
      element.replaceWith(iframe);
      options.events?.onReady?.({ target: player });
    },
  };
}

async function playOnce(page, song, touch) {
  await page.goto(`${base}${song.via}`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.__singAlong, null, { timeout: 8000 });
  await page.evaluate(() => {
    window.__playLog = [];
  });
  const button = page.locator(`[data-song="${song.slug}"] button`, { hasText: "Play" });
  if (touch) await button.tap();
  else await button.click();
  const result = await page.evaluate(() => ({
    state: window.__singAlong.getPlayerState(),
    log: window.__playLog,
  }));
  const started = result.log.some(
    (entry) => (entry.method === "playVideo" || entry.method === "loadVideoById") && entry.duringClick,
  );
  if (result.state !== 1 || !started) {
    throw new Error(`${song.slug} state=${result.state} log=${JSON.stringify(result.log)}`);
  }
  return result;
}

async function runProfile(browser, name, contextOptions) {
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  await page.addInitScript(stub);
  const results = [];
  for (const song of songs) {
    const result = await playOnce(page, song, Boolean(contextOptions.hasTouch));
    results.push({ song: song.slug, state: result.state, duringClick: true });
    console.log(`PASS ${name} ${song.slug} PLAYING during the tap`);
  }
  await context.close();
  return results;
}

async function realYouTube(browser) {
  const context = await browser.newContext({ ...devices["iPhone 13"] });
  const page = await context.newPage();
  await page.goto(`${base}/songs`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("[data-player-host] iframe", { timeout: 15000 });
  await page.waitForTimeout(4000);
  await page.evaluate(() => {
    window.__ytStates = [];
    window.addEventListener("message", (event) => {
      let data = event.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }
      const state = data?.info?.playerState;
      if (typeof state === "number") window.__ytStates.push(state);
    });
  });
  await page.locator('[data-song="this-little-light-of-mine"] button', { hasText: "Play" }).tap();
  let states = [];
  try {
    await page.waitForFunction(() => window.__ytStates.includes(1), { timeout: 12000 });
  } catch {
    // Real YouTube often refuses autoplay in this environment.
  }
  states = await page.evaluate(() => window.__ytStates);
  const iframe = await page.locator("iframe").count();
  console.log(`REAL iPhone YouTube states=${JSON.stringify(states)} iframes=${iframe}`);
  await context.close();
  return { states, iframe };
}

const browser = await chromium.launch({ executablePath: chrome, headless: true });
const iphone = devices["iPhone 13"];
const pixel = devices["Pixel 5"];
if (!iphone.hasTouch || !pixel.hasTouch) {
  throw new Error("device profiles are missing hasTouch");
}
await runProfile(browser, "iPhone 13", iphone);
await runProfile(browser, "Pixel 5", pixel);
await runProfile(browser, "desktop", { viewport: { width: 1280, height: 800 }, hasTouch: false });
const real = await realYouTube(browser);
await browser.close();
console.log(JSON.stringify({ stubbed: "pass", realYouTube: real }));
