export const TONIGHT_BADGE_STORAGE_KEY = "tonight-reading-badges.v1";

export type BadgeStore = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

export type CollectionState =
  | { status: "ready"; slugs: string[] }
  | { status: "unavailable" }
  | { status: "malformed" };

export type CollectOutcome =
  | { status: "saved"; already: boolean; slugs: string[] }
  | { status: "not-saved"; reason: "unavailable" | "malformed" | "write-failed" | "unknown-book" };

export type RemoteReconcile =
  | { action: "keep" }
  | { action: "replace"; slugs: string[] }
  | { action: "merge"; slugs: string[]; writeBack: boolean };

function uniqueSlugs(slugs: readonly string[]) {
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const slug of slugs) {
    if (seen.has(slug)) continue;
    seen.add(slug);
    unique.push(slug);
  }
  return unique;
}

export function parseCollection(raw: string | null): CollectionState {
  if (raw == null) return { status: "ready", slugs: [] };
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return { status: "malformed" };
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { status: "malformed" };
  }
  const record = value as { version?: unknown; slugs?: unknown };
  if (record.version !== 1 || !Array.isArray(record.slugs)) return { status: "malformed" };
  if (record.slugs.some((slug) => typeof slug !== "string")) return { status: "malformed" };
  return { status: "ready", slugs: uniqueSlugs(record.slugs as string[]) };
}

export function serializeCollection(slugs: readonly string[]) {
  return JSON.stringify({ version: 1, slugs });
}

export function readCollection(store: BadgeStore): CollectionState {
  try {
    return parseCollection(store.getItem(TONIGHT_BADGE_STORAGE_KEY));
  } catch {
    return { status: "unavailable" };
  }
}

export function countedSlugs(slugs: readonly string[], known: ReadonlySet<string>) {
  return slugs.filter((slug) => known.has(slug));
}

export function collectBook(
  store: BadgeStore,
  slug: string,
  known: ReadonlySet<string>,
): CollectOutcome {
  if (!known.has(slug)) return { status: "not-saved", reason: "unknown-book" };
  let current: CollectionState;
  try {
    current = parseCollection(store.getItem(TONIGHT_BADGE_STORAGE_KEY));
  } catch {
    return { status: "not-saved", reason: "unavailable" };
  }
  if (current.status !== "ready") return { status: "not-saved", reason: current.status };
  if (current.slugs.includes(slug)) {
    return { status: "saved", already: true, slugs: current.slugs };
  }
  const slugs = [...current.slugs, slug];
  try {
    store.setItem(TONIGHT_BADGE_STORAGE_KEY, serializeCollection(slugs));
  } catch {
    return { status: "not-saved", reason: "write-failed" };
  }
  let confirmed: CollectionState;
  try {
    confirmed = parseCollection(store.getItem(TONIGHT_BADGE_STORAGE_KEY));
  } catch {
    return { status: "not-saved", reason: "write-failed" };
  }
  if (confirmed.status !== "ready" || !confirmed.slugs.includes(slug)) {
    return { status: "not-saved", reason: "write-failed" };
  }
  return { status: "saved", already: false, slugs: confirmed.slugs };
}

export function reconcileStorageEvent(
  memorySlugs: readonly string[],
  remoteRaw: string | null,
): RemoteReconcile {
  if (remoteRaw == null) return { action: "replace", slugs: [] };
  const remote = parseCollection(remoteRaw);
  if (remote.status !== "ready") return { action: "keep" };
  const slugs = uniqueSlugs([...memorySlugs, ...remote.slugs]);
  const remoteSet = new Set(remote.slugs);
  const writeBack = slugs.some((slug) => !remoteSet.has(slug));
  return { action: "merge", slugs, writeBack };
}
