#!/usr/bin/env node

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  DEFAULT_HOST,
  DEFAULT_PORT,
  INSTANCE_PATH,
  LOG_PATH,
  REPO_ROOT,
  baseUrlFrom,
  doctorChecks,
  evidenceDir,
  killGroup,
  listeningPids,
  logTail,
  pidAlive,
  readInstance,
  removeRunState,
  spawnDevServer,
  waitForReady,
  waitUntilDead,
  writeInstance,
  writeJson,
} from "./lib.mjs";
import { driveTonight } from "./features/tonight.mjs";
import { driveHomepageCollection } from "./features/homepage-collection.mjs";
import { driveBookPages } from "./features/book-pages.mjs";
import { drivePlay } from "./features/play.mjs";
import { driveAskAngel } from "./features/ask-angel.mjs";

const FEATURES = {
  tonight: driveTonight,
  "homepage-collection": driveHomepageCollection,
  "book-pages": driveBookPages,
  play: drivePlay,
  "ask-angel": driveAskAngel,
};

function usage() {
  return `verify.mjs — drive Bible Stories for Little Hearts locally

Usage (from repo root):
  node .cursor/skills/verify-bible-stories-site/scripts/verify.mjs <command>

Commands:
  help                         print this text
  launch                       start npm run dev on VERIFY_PORT (default 4173)
  doctor                       read-only health check of the launched instance
  drive <feature>              playwright the named feature map recipe
  cleanup                      stop the launched process group; keep evidence/
  status                       show instance.json if present

Features:
  tonight | homepage-collection | book-pages | play | ask-angel

Env:
  VERIFY_PORT       listen port (default 4173). Do not use 3000 if a human is there.
  VERIFY_BASE_URL   override doctor/drive URL after launch
  VERIFY_EVIDENCE   optional absolute evidence parent directory

Examples:
  node .cursor/skills/verify-bible-stories-site/scripts/verify.mjs launch
  node .cursor/skills/verify-bible-stories-site/scripts/verify.mjs doctor
  node .cursor/skills/verify-bible-stories-site/scripts/verify.mjs drive tonight
  node .cursor/skills/verify-bible-stories-site/scripts/verify.mjs cleanup
`;
}

function fail(message, extra) {
  console.error(message);
  if (extra) console.error(extra);
  process.exitCode = 2;
}

async function cmdLaunch() {
  const port = DEFAULT_PORT;
  const host = DEFAULT_HOST;
  const existing = readInstance();

  if (existing && pidAlive(existing.pid)) {
    const url = baseUrlFrom(existing);
    const doctor = await doctorChecks(existing);
    if (doctor.ok) {
      console.log(`already running ${url} pid=${existing.pid}`);
      return;
    }
    console.error("stale or unhealthy instance; run cleanup, then launch again");
    console.error(JSON.stringify(doctor.checks, null, 2));
    process.exitCode = 2;
    return;
  }

  const foreign = listeningPids(port).filter((pid) => !existing || pid !== existing.pid);
  if (foreign.length) {
    fail(
      `port ${port} is already in use by pid(s) ${foreign.join(", ")} that this helper did not start`,
    );
    return;
  }

  const spawned = spawnDevServer({ port, host });
  const baseUrl = `http://${host}:${port}`;
  const instance = {
    pid: spawned.pid,
    groupPid: spawned.groupPid,
    port,
    host,
    baseUrl,
    cwd: REPO_ROOT,
    logPath: LOG_PATH,
    startedAt: new Date().toISOString(),
    command: `PORT=${port} npm run dev -- -H ${host} -p ${port}`,
  };
  writeInstance(instance);

  try {
    await waitForReady(`${baseUrl}/`);
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
    return;
  }

  console.log(`ready ${baseUrl} pid=${instance.pid}`);
  console.log(`instance ${INSTANCE_PATH}`);
}

async function cmdDoctor() {
  const doctor = await doctorChecks();
  console.log(JSON.stringify(doctor, null, 2));
  if (!doctor.ok) {
    console.error("\nlog tail:\n" + logTail());
    process.exitCode = 1;
  }
}

async function cmdDrive(feature) {
  if (!feature || !FEATURES[feature]) {
    fail(`unknown feature "${feature || ""}". Choose: ${Object.keys(FEATURES).join(", ")}`);
    return;
  }

  const doctor = await doctorChecks();
  if (!doctor.ok) {
    fail("doctor is red; refuse to drive", JSON.stringify(doctor.checks, null, 2));
    return;
  }

  const dir = process.env.VERIFY_EVIDENCE
    ? join(process.env.VERIFY_EVIDENCE, `${feature}`)
    : evidenceDir(feature);
  writeJson(join(dir, "doctor.json"), doctor);

  try {
    const result = await FEATURES[feature]({
      baseUrl: doctor.baseUrl,
      evidenceDir: dir,
      doctor,
    });
    console.log(`drove ${feature}`);
    console.log(`evidence ${dir}`);
    if (result) console.log(JSON.stringify(result));
  } catch (error) {
    writeFileSync(
      join(dir, "error.txt"),
      `${error instanceof Error ? error.stack || error.message : String(error)}\n`,
    );
    fail(`drive ${feature} failed: ${error instanceof Error ? error.message : String(error)}`);
    console.error(`partial evidence ${dir}`);
  }
}

async function cmdCleanup() {
  const instance = readInstance();
  if (!instance) {
    console.log("nothing to clean (no instance.json)");
    return;
  }

  if (!pidAlive(instance.pid) && !pidAlive(instance.groupPid)) {
    removeRunState();
    console.log("removed stale instance.json; evidence/ untouched");
    return;
  }

  killGroup(instance.groupPid || instance.pid);
  await waitUntilDead(instance.groupPid || instance.pid, instance.port);
  removeRunState();
  console.log(`stopped pid/group ${instance.groupPid || instance.pid}; evidence/ untouched`);
}

function cmdStatus() {
  const instance = readInstance();
  if (!instance) {
    console.log("no instance");
    return;
  }
  console.log(JSON.stringify({ ...instance, alive: pidAlive(instance.pid) }, null, 2));
}

const [command, feature] = process.argv.slice(2);

switch (command) {
  case "help":
  case undefined:
    console.log(usage());
    break;
  case "launch":
    await cmdLaunch();
    break;
  case "doctor":
    await cmdDoctor();
    break;
  case "drive":
    await cmdDrive(feature);
    break;
  case "cleanup":
    await cmdCleanup();
    break;
  case "status":
    cmdStatus();
    break;
  case "browser":
    fail(
      "named browser steps are not a separate session. Use: drive <feature> (see SKILL.md Helpers)",
    );
    break;
  default:
    fail(`unknown command "${command}"\n${usage()}`);
}
