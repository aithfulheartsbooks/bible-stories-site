import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { books } from "@/app/books";
import { resources } from "@/app/resources";
import {
  printableForSlug,
  seriesBadges,
  seriesSlugSet,
  tonightPrintables,
} from "@/lib/tonight-catalog";
import {
  TONIGHT_BADGE_STORAGE_KEY,
  collectBook,
  collectBookFrom,
  commitRemoteCollection,
  countedSlugs,
  parseCollection,
  readCollection,
  readCollectionFrom,
  reconcileStorageEvent,
  serializeCollection,
  type BadgeStore,
} from "@/lib/tonight-collection";
import {
  TONIGHT_DAY_MS,
  availableBooks,
  nextTonightBoundary,
  todaysBook,
  tonightDayIndex,
} from "@/lib/tonight";

const publicRoot = path.join(process.cwd(), "public");

function memoryStore(seed?: string | null): BadgeStore & { writes: number } {
  let raw = seed === undefined ? null : seed;
  return {
    writes: 0,
    getItem(key: string) {
      if (key !== TONIGHT_BADGE_STORAGE_KEY) return null;
      return raw;
    },
    setItem(key: string, value: string) {
      if (key !== TONIGHT_BADGE_STORAGE_KEY) return;
      raw = value;
      this.writes += 1;
    },
  };
}

test("the book follows the local calendar day from January 1", () => {
  assert.equal(new Date(2026, 0, 15).getTimezoneOffset(), 480);
  assert.equal(new Date(2026, 6, 15).getTimezoneOffset(), 420);
  assert.equal(availableBooks().length, 36);
  assert.equal(todaysBook(new Date(2026, 0, 1, 0, 0, 0)).slug, availableBooks()[0].slug);
  assert.equal(todaysBook(new Date(2026, 0, 1, 0, 0, 0)).slug, "noah-and-gods-big-promise");
  assert.equal(todaysBook(new Date(2026, 0, 2, 12, 0, 0)).slug, "david-and-the-giant");
  assert.equal(TONIGHT_DAY_MS, 86_400_000);

  const sameEvening = todaysBook(new Date(2026, 0, 14, 23, 59, 0));
  const sameAfternoon = todaysBook(new Date(2026, 0, 14, 15, 0, 0));
  assert.equal(sameEvening.slug, sameAfternoon.slug);
  assert.equal(sameEvening.slug, "jesus-calms-the-storm");
  assert.equal(todaysBook(new Date(2026, 0, 15, 0, 0, 0)).slug, "the-creation-story");
  assert.equal(
    nextTonightBoundary(new Date(2026, 0, 14, 23, 59, 0)).toString(),
    new Date(2026, 0, 15, 0, 0, 0).toString(),
  );
  assert.equal(
    nextTonightBoundary(new Date(2026, 0, 15, 0, 0, 0)).getTime() -
      new Date(2026, 0, 15, 0, 0, 0).getTime(),
    24 * 3_600_000,
  );
});

test("daylight saving still changes the book at local midnight", () => {
  const before = todaysBook(new Date(2026, 6, 14, 23, 59, 0));
  const midnight = todaysBook(new Date(2026, 6, 15, 0, 0, 0));
  const halfPast = todaysBook(new Date(2026, 6, 15, 0, 30, 0));
  const oneAm = todaysBook(new Date(2026, 6, 15, 1, 0, 0));
  assert.equal(before.slug, "the-creation-story");
  assert.equal(midnight.slug, "the-armor-of-god");
  assert.equal(halfPast.slug, midnight.slug);
  assert.equal(oneAm.slug, midnight.slug);
  assert.notEqual(before.slug, midnight.slug);
  assert.equal(
    nextTonightBoundary(new Date(2026, 6, 14, 23, 30, 0)).toString(),
    new Date(2026, 6, 15, 0, 0, 0).toString(),
  );
  assert.equal(
    nextTonightBoundary(new Date(2026, 6, 15, 0, 30, 0)).toString(),
    new Date(2026, 6, 16, 0, 0, 0).toString(),
  );
});

test("spring-forward and fall-back days keep one calendar index", () => {
  assert.equal(new Date(2026, 2, 8, 1, 30).getTimezoneOffset(), 480);
  assert.equal(new Date(2026, 2, 8, 3, 30).getTimezoneOffset(), 420);
  const march7 = todaysBook(new Date(2026, 2, 7, 23, 59, 0));
  const march8Early = todaysBook(new Date(2026, 2, 8, 0, 30, 0));
  const march8Late = todaysBook(new Date(2026, 2, 8, 3, 30, 0));
  const march9 = todaysBook(new Date(2026, 2, 9, 0, 0, 0));
  assert.equal(march7.slug, "pentecost-the-holy-spirit-comes");
  assert.equal(march8Early.slug, "elisha-and-the-widows-oil");
  assert.equal(march8Late.slug, march8Early.slug);
  assert.equal(march9.slug, "tower-of-babel");
  const springStart = new Date(2026, 2, 8, 0, 0, 0);
  assert.equal(nextTonightBoundary(springStart).getTime() - springStart.getTime(), 23 * 3_600_000);

  assert.equal(new Date(2026, 10, 1, 0, 30).getTimezoneOffset(), 420);
  assert.equal(new Date(2026, 10, 1, 3, 30).getTimezoneOffset(), 480);
  const firstOneThirty = new Date("2026-11-01T08:30:00Z");
  const secondOneThirty = new Date("2026-11-01T09:30:00Z");
  const november1 = todaysBook(new Date(2026, 10, 1, 0, 30, 0));
  assert.equal(todaysBook(new Date(2026, 9, 31, 23, 59, 0)).slug, "the-armor-of-god");
  assert.equal(november1.slug, "zacchaeus");
  assert.equal(todaysBook(firstOneThirty).slug, november1.slug);
  assert.equal(todaysBook(secondOneThirty).slug, november1.slug);
  assert.equal(todaysBook(new Date(2026, 10, 1, 3, 30, 0)).slug, november1.slug);
  assert.equal(todaysBook(new Date(2026, 10, 2, 0, 0, 0)).slug, "the-good-samaritan");
  const fallStart = new Date(2026, 10, 1, 0, 0, 0);
  assert.equal(nextTonightBoundary(fallStart).getTime() - fallStart.getTime(), 25 * 3_600_000);
  assert.equal(nextTonightBoundary(firstOneThirty).toString(), new Date(2026, 10, 2, 0, 0, 0).toString());
});

test("new year uses the new local January 1 epoch", () => {
  const newYearMoment = new Date(2027, 0, 1, 0, 0, 0);
  const nye = todaysBook(new Date(2026, 11, 31, 23, 30, 0));
  const newYear = todaysBook(newYearMoment);
  assert.equal(nye.slug, "daniel-and-the-lions");
  assert.equal(newYear.slug, "noah-and-gods-big-promise");
  assert.equal(tonightDayIndex(newYearMoment), 0);
});

test("every series book maps to one real coloring page or is omitted", () => {
  const available = books.filter((book) => book.status === "available");
  assert.equal(available.length, 36);
  assert.equal(seriesBadges.length, 36);
  assert.equal(Object.keys(tonightPrintables).length, 36);

  const audit = available.map((book) => {
    const printable = printableForSlug(book.slug);
    const hrefPath = printable ? path.join(publicRoot, printable.href) : "";
    const previewPath = printable ? path.join(publicRoot, printable.previewSrc) : "";
    const hrefOk = printable ? fs.existsSync(hrefPath) && fs.statSync(hrefPath).size > 1000 : false;
    const previewOk = printable
      ? fs.existsSync(previewPath) && fs.statSync(previewPath).size > 1000
      : false;
    const pdf = printable ? fs.readFileSync(hrefPath).subarray(0, 5).toString() : "";
    return {
      number: book.number,
      slug: book.slug,
      title: book.title,
      coverImage: book.coverImage,
      printable: printable
        ? {
            type: printable.type,
            href: printable.href,
            previewSrc: printable.previewSrc,
            hrefOk,
            previewOk,
            pdf,
          }
        : null,
    };
  });

  for (const row of audit) {
    assert.equal(seriesSlugSet.has(row.slug), true, row.slug);
    assert.ok(row.coverImage);
    assert.ok(fs.existsSync(path.join(publicRoot, row.coverImage!)));
    assert.ok(row.printable, `${row.slug} omitted`);
    assert.equal(row.printable?.type, "Coloring Page");
    assert.equal(row.printable?.hrefOk, true, row.printable?.href);
    assert.equal(row.printable?.previewOk, true, row.printable?.previewSrc);
    assert.equal(row.printable?.pdf, "%PDF-");
    const catalog = resources.find(
      (resource) => resource.type === "Coloring Page" && resource.book === row.number,
    );
    assert.equal(row.printable?.href, catalog?.href);
  }

  assert.equal(
    tonightPrintables["the-feeding-of-the-5000"].href,
    "/resources/feeding-the-5000-coloring-page.pdf",
  );
  assert.equal(
    tonightPrintables["adam-and-eve-in-the-garden"].href,
    "/resources/adam-and-eve-coloring-page.pdf",
  );
  assert.equal(
    printableForSlug("not-a-book"),
    null,
  );

  const omitted = audit.filter((row) => !row.printable);
  assert.deepEqual(omitted, []);
});

test("collect is idempotent and confirms the stored slug", () => {
  const store = memoryStore();
  const first = collectBook(store, "noah-and-gods-big-promise", seriesSlugSet);
  const second = collectBook(store, "noah-and-gods-big-promise", seriesSlugSet);
  assert.equal(first.status, "saved");
  assert.equal(second.status, "saved");
  if (first.status === "saved" && second.status === "saved") {
    assert.equal(first.already, false);
    assert.equal(second.already, true);
    assert.equal(countedSlugs(second.slugs, seriesSlugSet).length, 1);
  }
  assert.equal(store.writes, 1);
  const again = readCollection(store);
  assert.equal(again.status, "ready");
  if (again.status === "ready") assert.deepEqual(again.slugs, ["noah-and-gods-big-promise"]);
});

test("malformed and throwing storage are not reported as saved", () => {
  const malformed = memoryStore("{");
  const bad = collectBook(malformed, "noah-and-gods-big-promise", seriesSlugSet);
  assert.deepEqual(bad, { status: "not-saved", reason: "malformed" });
  assert.equal(malformed.writes, 0);
  assert.equal(malformed.getItem(TONIGHT_BADGE_STORAGE_KEY), "{");
  assert.equal(parseCollection("[]").status, "malformed");
  assert.equal(parseCollection('{"version":1,"slugs":[1]}').status, "malformed");

  const throwing: BadgeStore = {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("blocked");
    },
  };
  assert.equal(readCollection(throwing).status, "unavailable");
  assert.deepEqual(collectBook(throwing, "noah-and-gods-big-promise", seriesSlugSet), {
    status: "not-saved",
    reason: "unavailable",
  });

  const writeFail = memoryStore(null);
  writeFail.setItem = () => {
    throw new Error("quota");
  };
  assert.deepEqual(collectBook(writeFail, "david-and-the-giant", seriesSlugSet), {
    status: "not-saved",
    reason: "write-failed",
  });

  const lied: BadgeStore = {
    getItem() {
      return null;
    },
    setItem() {},
  };
  assert.deepEqual(collectBook(lied, "david-and-the-giant", seriesSlugSet), {
    status: "not-saved",
    reason: "write-failed",
  });
  assert.deepEqual(collectBook(memoryStore(), "not-a-book", seriesSlugSet), {
    status: "not-saved",
    reason: "unknown-book",
  });
});

test("acquiring storage is inside the guard", () => {
  const acquire = () => {
    throw new DOMException("The operation is insecure.", "SecurityError");
  };
  assert.equal(readCollectionFrom(acquire).status, "unavailable");
  assert.deepEqual(collectBookFrom(acquire, "noah-and-gods-big-promise", seriesSlugSet), {
    status: "not-saved",
    reason: "unavailable",
  });
  assert.deepEqual(
    commitRemoteCollection(acquire, ["noah-and-gods-big-promise"], serializeCollection(["david-and-the-giant"])),
    { action: "ready", slugs: ["david-and-the-giant"], notice: "write-failed" },
  );
});

test("unconfirmed write-back does not claim the local-only slug", () => {
  const blocked = memoryStore(serializeCollection(["david-and-the-giant"]));
  blocked.setItem = () => {
    throw new Error("quota");
  };
  assert.deepEqual(
    commitRemoteCollection(
      () => blocked,
      ["noah-and-gods-big-promise"],
      serializeCollection(["david-and-the-giant"]),
    ),
    { action: "ready", slugs: ["david-and-the-giant"], notice: "write-failed" },
  );

  const lying = memoryStore(serializeCollection(["david-and-the-giant"]));
  lying.setItem = () => {};
  assert.deepEqual(
    commitRemoteCollection(
      () => lying,
      ["noah-and-gods-big-promise"],
      serializeCollection(["david-and-the-giant"]),
    ),
    { action: "ready", slugs: ["david-and-the-giant"], notice: "write-failed" },
  );

  const confirmed = commitRemoteCollection(
    () => memoryStore(serializeCollection(["david-and-the-giant"])),
    ["noah-and-gods-big-promise"],
    serializeCollection(["david-and-the-giant"]),
  );
  assert.deepEqual(confirmed, {
    action: "ready",
    slugs: ["noah-and-gods-big-promise", "david-and-the-giant"],
    notice: null,
  });
});

test("cross-tab merge keeps both slugs and does not rewrite a malformed value", () => {
  const left = ["noah-and-gods-big-promise"];
  const remote = serializeCollection(["david-and-the-giant"]);
  const merged = reconcileStorageEvent(left, remote);
  assert.equal(merged.action, "merge");
  if (merged.action === "merge") {
    assert.deepEqual(merged.slugs, ["noah-and-gods-big-promise", "david-and-the-giant"]);
    assert.equal(merged.writeBack, true);
    const settled = reconcileStorageEvent(merged.slugs, serializeCollection(merged.slugs));
    assert.equal(settled.action, "merge");
    if (settled.action === "merge") assert.equal(settled.writeBack, false);
  }
  assert.deepEqual(reconcileStorageEvent(left, "{"), { action: "keep" });
  assert.deepEqual(reconcileStorageEvent(left, null), { action: "replace", slugs: [] });

  const preserved = parseCollection(
    serializeCollection(["custom-future-slug", "noah-and-gods-big-promise"]),
  );
  assert.equal(preserved.status, "ready");
  if (preserved.status === "ready") {
    assert.deepEqual(countedSlugs(preserved.slugs, seriesSlugSet), ["noah-and-gods-big-promise"]);
    const added = collectBook(
      memoryStore(serializeCollection(preserved.slugs)),
      "david-and-the-giant",
      seriesSlugSet,
    );
    assert.equal(added.status, "saved");
    if (added.status === "saved") {
      assert.deepEqual(added.slugs, [
        "custom-future-slug",
        "noah-and-gods-big-promise",
        "david-and-the-giant",
      ]);
    }
  }
});
