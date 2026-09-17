import { execFileSync, spawn } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const SKILL_DIR = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
);
export const REPO_ROOT = resolve(SKILL_DIR, "../../..");
export const RUN_DIR = join(SKILL_DIR, ".run");
export const INSTANCE_PATH = join(RUN_DIR, "instance.json");
export const LOG_PATH = join(RUN_DIR, "next.log");
export const EVIDENCE_ROOT = join(SKILL_DIR, "evidence");

export const DEFAULT_PORT = Number(process.env.VERIFY_PORT || 4173);
export const DEFAULT_HOST = "127.0.0.1";

export function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

export function stamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    "-",
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join("");
}

export function readInstance() {
  if (!existsSync(INSTANCE_PATH)) return null;
  try {
    return JSON.parse(readFileSync(INSTANCE_PATH, "utf8"));
  } catch {
    return null;
  }
}

export function writeInstance(instance) {
  ensureDir(RUN_DIR);
  writeFileSync(INSTANCE_PATH, `${JSON.stringify(instance, null, 2)}\n`);
}

export function baseUrlFrom(instance = readInstance()) {
  if (process.env.VERIFY_BASE_URL) return process.env.VERIFY_BASE_URL.replace(/\/$/, "");
  if (instance?.baseUrl) return instance.baseUrl.replace(/\/$/, "");
  return `http://${DEFAULT_HOST}:${DEFAULT_PORT}`;
}

export function pidAlive(pid) {
  if (!pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

export async function fetchText(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { redirect: "manual", signal: controller.signal });
    const body = await response.text();
    return { ok: response.ok, status: response.status, body, headers: response.headers };
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchJson(url, timeoutMs = 8000) {
  const result = await fetchText(url, timeoutMs);
  let json = null;
  try {
    json = JSON.parse(result.body);
  } catch {
    json = null;
  }
  return { ...result, json };
}

export function logTail(path = LOG_PATH, lines = 40) {
  if (!existsSync(path)) return "(no log file)";
  const text = readFileSync(path, "utf8").trim().split("\n");
  return text.slice(-lines).join("\n");
}

export function listeningPids(port) {
  try {
    const out = execFileSync("ss", ["-ltnp"], { encoding: "utf8" });
    const rows = out.split("\n").filter((line) => line.includes(`:${port} `) || line.includes(`:${port}\n`));
    const pids = new Set();
    for (const row of rows) {
      for (const match of row.matchAll(/pid=(\d+)/g)) {
        pids.add(Number(match[1]));
      }
    }
    if (pids.size) return [...pids];
  } catch {
    // ss may be missing.
  }

  try {
    const out = execFileSync("lsof", ["-iTCP:" + port, "-sTCP:LISTEN", "-t"], {
      encoding: "utf8",
    });
    return out
      .split("\n")
      .map((line) => Number(line.trim()))
      .filter(Boolean);
  } catch {
    return [];
  }
}

export function sameProcessGroup(pid, groupPid) {
  if (!pid || !groupPid) return false;
  if (pid === groupPid) return true;
  try {
    const stat = readFileSync(`/proc/${pid}/stat`, "utf8");
    const close = stat.lastIndexOf(")");
    const rest = stat.slice(close + 2).split(" ");
    const pgid = Number(rest[2]);
    return pgid === groupPid;
  } catch {
    return false;
  }
}

export function spawnDevServer({ port, host }) {
  ensureDir(RUN_DIR);
  writeFileSync(LOG_PATH, "");
  const logFd = openSync(LOG_PATH, "a");
  const child = spawn("npm", ["run", "dev", "--", "-H", host, "-p", String(port)], {
    cwd: REPO_ROOT,
    env: {
      ...process.env,
      PORT: String(port),
      BROWSER: "none",
      HOSTNAME: host,
    },
    detached: true,
    stdio: ["ignore", logFd, logFd],
  });
  child.unref();

  return {
    pid: child.pid,
    groupPid: child.pid,
  };
}

export async function waitForReady(url, timeoutMs = 90_000) {
  const started = Date.now();
  let last = "not fetched";
  while (Date.now() - started < timeoutMs) {
    try {
      const result = await fetchText(url, 3000);
      last = `HTTP ${result.status}`;
      if (result.status === 200 && result.body.includes("Bible Stories for Little Hearts")) {
        return result;
      }
    } catch (error) {
      last = error instanceof Error ? error.message : String(error);
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 500));
  }
  throw new Error(`Timed out waiting for ${url} (${last})\n${logTail()}`);
}

export function killGroup(groupPid) {
  if (!groupPid || !pidAlive(groupPid)) return;
  try {
    process.kill(-groupPid, "SIGTERM");
  } catch {
    try {
      process.kill(groupPid, "SIGTERM");
    } catch {
      // already gone
    }
  }
}

export async function waitUntilDead(groupPid, port, timeoutMs = 10_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const alive = pidAlive(groupPid);
    const listeners = listeningPids(port);
    if (!alive && listeners.length === 0) return;
    await new Promise((resolveWait) => setTimeout(resolveWait, 200));
  }
  if (pidAlive(groupPid)) {
    try {
      process.kill(-groupPid, "SIGKILL");
    } catch {
      try {
        process.kill(groupPid, "SIGKILL");
      } catch {
        // ignore
      }
    }
  }
}

export function removeRunState() {
  rmSync(INSTANCE_PATH, { force: true });
  rmSync(LOG_PATH, { force: true });
}

export function evidenceDir(feature) {
  const dir = join(EVIDENCE_ROOT, `${stamp()}-${feature}`);
  ensureDir(dir);
  return dir;
}

export function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

export async function doctorChecks(instance = readInstance()) {
  const checks = [];
  const fail = (name, detail) => {
    checks.push({ name, ok: false, detail });
  };
  const pass = (name, detail) => {
    checks.push({ name, ok: true, detail });
  };

  if (!instance) {
    fail("instance-file", `missing ${INSTANCE_PATH}`);
    return { ok: false, checks, instance: null };
  }

  if (!pidAlive(instance.pid)) {
    fail("pid-alive", `pid ${instance.pid} is not running`);
  } else {
    pass("pid-alive", `pid ${instance.pid} is running`);
  }

  const url = baseUrlFrom(instance);
  try {
    const home = await fetchText(`${url}/`);
    if (home.status === 200 && home.body.includes("Bible Stories for Little Hearts")) {
      pass("home-html", `GET / -> ${home.status}`);
    } else {
      fail("home-html", `GET / -> ${home.status}, missing brand text`);
    }
  } catch (error) {
    fail("home-html", error instanceof Error ? error.message : String(error));
  }

  try {
    const tonight = await fetchText(`${url}/tonight`);
    if (tonight.status === 200 && tonight.body.includes("Tonight's story")) {
      pass("tonight-html", `GET /tonight -> ${tonight.status}`);
    } else {
      fail("tonight-html", `GET /tonight -> ${tonight.status}, missing Tonight's story`);
    }
  } catch (error) {
    fail("tonight-html", error instanceof Error ? error.message : String(error));
  }

  try {
    const books = await fetchJson(`${url}/api/ask-angel-books`);
    if (
      books.status === 200 &&
      books.json &&
      Number(books.json.count) > 0 &&
      Array.isArray(books.json.books)
    ) {
      pass("ask-angel-books", `count=${books.json.count}`);
    } else {
      fail("ask-angel-books", `GET /api/ask-angel-books -> ${books.status}`);
    }
  } catch (error) {
    fail("ask-angel-books", error instanceof Error ? error.message : String(error));
  }

  const listeners = listeningPids(instance.port);
  const ours = listeners.filter(
    (pid) => pid === instance.pid || pid === instance.groupPid || sameProcessGroup(pid, instance.groupPid),
  );
  const homeOk = checks.some((check) => check.name === "home-html" && check.ok);
  if (ours.length) {
    pass("port-owner", `port ${instance.port} pids=${ours.join(",")}`);
  } else if (listeners.length) {
    fail(
      "port-owner",
      `port ${instance.port} owned by pids ${listeners.join(",")}, not group ${instance.groupPid}`,
    );
  } else if (homeOk && pidAlive(instance.pid)) {
    pass(
      "port-owner",
      `port ${instance.port} answers HTTP 200 for launched pid ${instance.pid}; ss/lsof did not report a listener`,
    );
  } else {
    fail("port-owner", `nothing listening on ${instance.port}`);
  }

  return {
    ok: checks.every((check) => check.ok),
    checks,
    instance,
    baseUrl: url,
  };
}
