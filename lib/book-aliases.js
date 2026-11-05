// @ts-check
const fs = require("fs");
const path = require("path");

/**
 * Published book slugs. Kept in lockstep with the literal `slug:` values in
 * app/books.ts: a new book fails the build until this list is updated, which
 * stops a short alias from silently pointing at a removed or renamed page.
 */
const publishedBookSlugs = /** @type {const} */ ([
  "noah-and-gods-big-promise",
  "david-and-the-giant",
  "moses-and-the-red-sea",
  "jonah-and-the-big-fish",
  "daniel-and-the-lions",
  "esther-the-brave-queen",
  "the-christmas-story",
  "josephs-colorful-coat",
  "the-easter-story",
  "ruth-and-naomi",
  "the-birth-of-moses",
  "solomon-and-wisdom",
  "elijah-and-the-still-small-voice",
  "jesus-calms-the-storm",
  "the-creation-story",
  "the-armor-of-god",
  "zacchaeus",
  "the-good-samaritan",
  "the-lost-sheep",
  "the-feeding-of-the-5000",
  "adam-and-eve-in-the-garden",
  "joshua-and-jericho",
  "the-fiery-furnace",
  "the-prodigal-son",
  "jesus-welcomes-children",
  "the-wedding-at-cana",
  "hannahs-prayer-and-young-samuel",
  "saul-becomes-paul",
  "paul-and-silas-in-prison",
  "pentecost-the-holy-spirit-comes",
  "elisha-and-the-widows-oil",
  "tower-of-babel",
  "gideons-tiny-army",
  "nehemiah-builds-the-wall",
  "jesus-walks-on-water",
  "lazarus-comes-out",
]);

/** @typedef {(typeof publishedBookSlugs)[number]} BookSlug */

/**
 * Short names that each appear inside exactly one published slug.
 * Destinations are resolved from that unique match. They are not typed in by hand.
 */
const curatedShortAliases = [
  "adam",
  "adam-and-eve",
  "armor",
  "babel",
  "cana",
  "christmas",
  "creation",
  "daniel",
  "david",
  "easter",
  "elijah",
  "elisha",
  "esther",
  "eve",
  "feeding",
  "furnace",
  "gideon",
  "gideons",
  "hannah",
  "hannahs",
  "hannahs-prayer",
  "jericho",
  "jesus-calms",
  "jesus-walks",
  "jesus-welcomes",
  "jonah",
  "joseph",
  "josephs",
  "joshua",
  "lazarus",
  "naomi",
  "nehemiah",
  "noah",
  "paul-and-silas",
  "pentecost",
  "prodigal",
  "red-sea",
  "ruth",
  "samuel",
  "samaritan",
  "saul",
  "sheep",
  "silas",
  "solomon",
  "tower",
  "wedding",
];

/**
 * Names that are not a unique substring of one book slug.
 * feeding-the-5000 is Book 20's coloring-page slug in app/resources.ts.
 * elijah-still-small-voice is the cover filename for Elijah in app/books.ts.
 * feeding-5000 and jesus-calms-storm drop a word from the live slug.
 * These still have to match at most one book. Names that match several books
 * belong in chosenBookAliases.
 *
 * @type {Readonly<Record<string, BookSlug>>}
 */
const explicitBookAliases = {
  "elijah-still-small-voice": "elijah-and-the-still-small-voice",
  "feeding-5000": "the-feeding-of-the-5000",
  "feeding-the-5000": "the-feeding-of-the-5000",
  "jesus-calms-storm": "jesus-calms-the-storm",
};

/**
 * Explicit winners for short names that match more than one live book.
 * These are not produced by the unique-match rule. Each alias still has to
 * occur inside the chosen slug, and inside at least one other slug.
 *
 * @type {Readonly<Record<string, BookSlug>>}
 */
const chosenBookAliases = {
  jesus: "jesus-welcomes-children",
  moses: "moses-and-the-red-sea",
  paul: "paul-and-silas-in-prison",
};

const ALIAS_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * @param {readonly string[]} slugs
 */
function assertSlugInventory(slugs) {
  const source = fs.readFileSync(
    path.join(__dirname, "../app/books.ts"),
    "utf8",
  );
  const fromSource = [...source.matchAll(/^[ \t]*slug:\s*"([^"]+)"/gm)].map(
    (match) => match[1],
  );
  const expected = [...fromSource].sort();
  const actual = [...slugs].sort();
  const missing = expected.filter((slug) => !actual.includes(slug));
  const extra = actual.filter((slug) => !expected.includes(slug));
  if (
    expected.length !== actual.length ||
    expected.some((slug, index) => slug !== actual[index])
  ) {
    throw new Error(
      `publishedBookSlugs does not match app/books.ts slug literals.\nmissing: ${missing.join(", ") || "(none)"}\nextra: ${extra.join(", ") || "(none)"}`,
    );
  }
}

/**
 * @param {string} alias
 * @param {readonly string[]} slugs
 * @returns {BookSlug}
 */
function uniqueSlugContaining(alias, slugs) {
  const matches = slugs.filter((slug) => slug.includes(alias));
  if (matches.length !== 1) {
    throw new Error(
      `Alias "${alias}" must match exactly one book slug, matched ${matches.length}: ${matches.join(", ") || "(none)"}`,
    );
  }
  const target = matches[0];
  if (target === alias) {
    throw new Error(
      `Alias "${alias}" is already a book slug. Refusing to redirect a live page.`,
    );
  }
  return /** @type {BookSlug} */ (target);
}

/**
 * @param {string} alias
 * @param {string} target
 * @param {readonly string[]} slugs
 */
function assertExplicitAlias(alias, target, slugs) {
  if (!ALIAS_PATTERN.test(alias)) {
    throw new Error(`Alias "${alias}" must be a lowercase book path segment.`);
  }
  if (slugs.includes(alias)) {
    throw new Error(
      `Alias "${alias}" is already a book slug. Refusing to redirect a live page.`,
    );
  }
  if (!slugs.includes(target)) {
    throw new Error(`Alias "${alias}" targets unknown slug "${target}".`);
  }
  const matches = slugs.filter((slug) => slug.includes(alias));
  if (matches.length > 1) {
    throw new Error(
      `Explicit alias "${alias}" is ambiguous: ${matches.join(", ")}`,
    );
  }
  if (matches.length === 1 && matches[0] !== target) {
    throw new Error(
      `Explicit alias "${alias}" is contained in "${matches[0]}" but targets "${target}".`,
    );
  }
}

/**
 * @param {string} alias
 * @param {string} target
 * @param {readonly string[]} slugs
 */
function assertChosenAlias(alias, target, slugs) {
  if (!ALIAS_PATTERN.test(alias)) {
    throw new Error(`Alias "${alias}" must be a lowercase book path segment.`);
  }
  if (slugs.includes(alias)) {
    throw new Error(
      `Alias "${alias}" is already a book slug. Refusing to redirect a live page.`,
    );
  }
  if (!slugs.includes(target)) {
    throw new Error(`Alias "${alias}" targets unknown slug "${target}".`);
  }
  const matches = slugs.filter((slug) => slug.includes(alias));
  if (matches.length < 2) {
    throw new Error(
      `Chosen alias "${alias}" matches ${matches.length} book slug(s) (${matches.join(", ") || "none"}). Overrides are only for names that match more than one book.`,
    );
  }
  if (!matches.includes(target)) {
    throw new Error(
      `Chosen alias "${alias}" targets "${target}", which is not one of: ${matches.join(", ")}`,
    );
  }
}

function buildBookAliasMap() {
  assertSlugInventory(publishedBookSlugs);
  /** @type {readonly string[]} */
  const liveSlugList = publishedBookSlugs;
  const liveSlugs = new Set(liveSlugList);

  /** @type {Record<string, BookSlug>} */
  const map = {};

  /**
   * @param {string} alias
   * @param {BookSlug} target
   */
  const add = (alias, target) => {
    if (!ALIAS_PATTERN.test(alias)) {
      throw new Error(`Alias "${alias}" must be a lowercase book path segment.`);
    }
    if (liveSlugs.has(alias)) {
      throw new Error(
        `Alias "${alias}" is already a book slug. Refusing to redirect a live page.`,
      );
    }
    const existing = map[alias];
    if (existing && existing !== target) {
      throw new Error(
        `Alias "${alias}" already targets "${existing}" and cannot also target "${target}".`,
      );
    }
    map[alias] = target;
  };

  for (const slug of publishedBookSlugs) {
    if (slug.startsWith("the-")) {
      const alias = slug.slice("the-".length);
      const target = uniqueSlugContaining(alias, publishedBookSlugs);
      if (target !== slug) {
        throw new Error(
          `Generated alias "${alias}" from "${slug}" resolved to "${target}".`,
        );
      }
      add(alias, target);
    }
    if (slug.startsWith("jesus-")) {
      const alias = slug.slice("jesus-".length);
      const target = uniqueSlugContaining(alias, publishedBookSlugs);
      if (target !== slug) {
        throw new Error(
          `Generated alias "${alias}" from "${slug}" resolved to "${target}".`,
        );
      }
      add(alias, target);
    }
  }

  const seenCurated = new Set();
  for (const alias of curatedShortAliases) {
    if (seenCurated.has(alias)) {
      throw new Error(`Duplicate curated alias "${alias}".`);
    }
    seenCurated.add(alias);
    add(alias, uniqueSlugContaining(alias, publishedBookSlugs));
  }

  for (const [alias, target] of Object.entries(explicitBookAliases)) {
    assertExplicitAlias(alias, target, publishedBookSlugs);
    add(alias, target);
  }

  for (const [alias, target] of Object.entries(chosenBookAliases)) {
    assertChosenAlias(alias, target, publishedBookSlugs);
    add(alias, target);
  }

  return Object.freeze(map);
}

const bookAliases = buildBookAliasMap();

function bookAliasRedirects() {
  return Object.entries(bookAliases)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([alias, slug]) => ({
      source: `/book/${alias}`,
      destination: `/book/${slug}`,
      statusCode: /** @type {301} */ (301),
    }));
}

module.exports = {
  bookAliases,
  bookAliasRedirects,
  chosenBookAliases,
  curatedShortAliases,
  explicitBookAliases,
  publishedBookSlugs,
};
