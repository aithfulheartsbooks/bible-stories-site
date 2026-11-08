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

export function readCollectionFrom(acquire: () => BadgeStore): CollectionState {
  try {
    return readCollection(acquire());
  } catch {
    return { status: "unavailable" };
  }
}

export function collectBookFrom(
  acquire: () => BadgeStore,
  slug: string,
  known: ReadonlySet<string>,
): CollectOutcome {
  try {
    return collectBook(acquire(), slug, known);
  } catch {
    return { status: "not-saved", reason: "unavailable" };
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

export type RemoteCommit =
  | { action: "keep" }
  | { action: "ready"; slugs: string[]; notice: "write-failed" | null };

function persistedRemote(remoteRaw: string | null) {
  const remote = parseCollection(remoteRaw);
  return remote.status === "ready" ? remote.slugs : [];
}

/** Applies another tab's write. A slug is returned only when this call confirmed it is stored. */
export function commitRemoteCollection(
  acquire: () => BadgeStore,
  memorySlugs: readonly string[],
  remoteRaw: string | null,
): RemoteCommit {
  const reconciled = reconcileStorageEvent(memorySlugs, remoteRaw);
  if (reconciled.action === "keep") return { action: "keep" };
  if (reconciled.action === "replace" || !reconciled.writeBack) {
    return { action: "ready", slugs: reconciled.slugs, notice: null };
  }
  try {
    const store = acquire();
    store.setItem(TONIGHT_BADGE_STORAGE_KEY, serializeCollection(reconciled.slugs));
    const confirmed = parseCollection(store.getItem(TONIGHT_BADGE_STORAGE_KEY));
    if (
      confirmed.status === "ready" &&
      reconciled.slugs.every((slug) => confirmed.slugs.includes(slug))
    ) {
      return { action: "ready", slugs: confirmed.slugs, notice: null };
    }
  } catch {
    // The union was not confirmed. Fall through to the remote payload, which the event already stored.
  }
  return { action: "ready", slugs: persistedRemote(remoteRaw), notice: "write-failed" };
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
