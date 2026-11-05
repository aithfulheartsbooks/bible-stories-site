const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const {
  bookAliases,
  bookAliasRedirects,
  chosenBookAliases,
  curatedShortAliases,
  explicitBookAliases,
  publishedBookSlugs,
} = require("./book-aliases");
const nextConfig = require("../next.config");

const booksSource = fs.readFileSync(
  path.join(__dirname, "../app/books.ts"),
  "utf8",
);
const resourcesSource = fs.readFileSync(
  path.join(__dirname, "../app/resources.ts"),
  "utf8",
);

function literalBookSlugs(source) {
  return [...source.matchAll(/^[ \t]*slug:\s*"([^"]+)"/gm)].map(
    (match) => match[1],
  );
}

function parsePublishedBooks(source) {
  return source
    .split(/\n {2}\{\n/)
    .slice(1)
    .map((chunk) => {
      const number = /number: "([^"]+)"/.exec(chunk)?.[1];
      const slug = /slug: "([^"]+)"/.exec(chunk)?.[1];
      const coverImage = /coverImage: "([^"]+)"/.exec(chunk)?.[1];
      const status = /status: "([^"]+)"/.exec(chunk)?.[1];
      return { number, slug, coverImage, status };
    })
    .filter((book) => book.slug && book.status);
}

function slugsContaining(alias, slugs) {
  return slugs.filter((slug) => slug.includes(alias));
}

const bookSlugs = literalBookSlugs(booksSource);
const publishedBooks = parsePublishedBooks(booksSource);

test("published slug list matches app/books.ts and every book is live", () => {
  assert.deepEqual([...publishedBookSlugs].sort(), [...bookSlugs].sort());
  assert.equal(publishedBooks.length, bookSlugs.length);
  assert.ok(publishedBooks.every((book) => book.status === "available"));
  assert.equal(new Set(bookSlugs).size, bookSlugs.length);
});

test("required short names redirect to the one matching book", () => {
  const required = {
    babel: "tower-of-babel",
    daniel: "daniel-and-the-lions",
    david: "david-and-the-giant",
    elijah: "elijah-and-the-still-small-voice",
    esther: "esther-the-brave-queen",
    gideon: "gideons-tiny-army",
    jonah: "jonah-and-the-big-fish",
    joseph: "josephs-colorful-coat",
    lazarus: "lazarus-comes-out",
    nehemiah: "nehemiah-builds-the-wall",
    noah: "noah-and-gods-big-promise",
    pentecost: "pentecost-the-holy-spirit-comes",
    ruth: "ruth-and-naomi",
    solomon: "solomon-and-wisdom",
  };

  for (const [alias, slug] of Object.entries(required)) {
    assert.equal(bookAliases[alias], slug);
    assert.deepEqual(slugsContaining(alias, bookSlugs), [slug]);
  }
});

test("chosen overrides redirect ambiguous shorts to Henry's books", () => {
  const chosen = {
    jesus: "jesus-welcomes-children",
    moses: "moses-and-the-red-sea",
    paul: "paul-and-silas-in-prison",
  };
  assert.deepEqual(chosenBookAliases, chosen);
  assert.deepEqual(
    curatedShortAliases.filter((alias) => alias in chosen),
    [],
  );

  for (const [alias, slug] of Object.entries(chosen)) {
    const matches = slugsContaining(alias, bookSlugs);
    assert.ok(matches.length > 1, alias);
    assert.ok(matches.includes(slug), alias);
    assert.equal(bookAliases[alias], slug);
    assert.equal(curatedShortAliases.includes(alias), false);
  }
});

test("no alias redirects away from a live book slug", () => {
  for (const slug of bookSlugs) {
    assert.equal(bookAliases[slug], undefined);
  }
  assert.equal(bookAliases.zacchaeus, undefined);
  assert.ok(bookSlugs.includes("zacchaeus"));
});

test("every alias targets the unique containing slug, or an explicit override", () => {
  const exceptions = {
    "elijah-still-small-voice": "elijah-and-the-still-small-voice",
    "feeding-the-5000": "the-feeding-of-the-5000",
  };
  const chosen = {
    jesus: "jesus-welcomes-children",
    moses: "moses-and-the-red-sea",
    paul: "paul-and-silas-in-prison",
  };
  assert.deepEqual(explicitBookAliases, exceptions);
  assert.deepEqual(chosenBookAliases, chosen);

  for (const [alias, target] of Object.entries(bookAliases)) {
    assert.match(alias, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(bookSlugs.includes(target), `${alias} -> ${target}`);
    assert.notEqual(alias, target);
    const matches = slugsContaining(alias, bookSlugs);
    if (chosen[alias]) {
      assert.equal(target, chosen[alias]);
      assert.ok(matches.length > 1, alias);
      assert.ok(matches.includes(target), alias);
      continue;
    }
    if (exceptions[alias]) {
      assert.equal(target, exceptions[alias]);
      assert.ok(matches.length <= 1);
      if (matches.length === 1) assert.equal(matches[0], target);
      continue;
    }
    assert.deepEqual(matches, [target], alias);
  }
});

test("dropping a leading the- or jesus- redirects to that same book", () => {
  for (const slug of bookSlugs) {
    if (slug.startsWith("the-")) {
      const alias = slug.slice(4);
      assert.equal(bookAliases[alias], slug);
    }
    if (slug.startsWith("jesus-")) {
      const alias = slug.slice("jesus-".length);
      assert.equal(bookAliases[alias], slug);
    }
  }
});

test("curated shorts are the expected set and each is unique", () => {
  assert.deepEqual(curatedShortAliases, [
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
  ]);

  for (const alias of curatedShortAliases) {
    const matches = slugsContaining(alias, bookSlugs);
    assert.equal(matches.length, 1, alias);
    assert.equal(bookAliases[alias], matches[0]);
  }
});

test("cover filename stems redirect when they name one book", () => {
  for (const book of publishedBooks) {
    assert.ok(book.coverImage, book.slug);
    const stem = path.basename(book.coverImage, path.extname(book.coverImage));
    const matches = slugsContaining(stem, bookSlugs);
    if (stem === book.slug) {
      assert.equal(bookAliases[stem], undefined, stem);
      continue;
    }
    if (matches.length > 1) {
      if (bookAliases[stem] !== undefined) {
        assert.equal(chosenBookAliases[stem], bookAliases[stem], stem);
        assert.ok(matches.includes(bookAliases[stem]), stem);
      }
      continue;
    }
    assert.equal(bookAliases[stem], book.slug, stem);
  }
});

test("coloring-page slugs that differ from the book slug redirect to that book", () => {
  const coloring = [
    ...resourcesSource.matchAll(/"(Book \d+)": "([^"]+)"/g),
  ].map((match) => ({ number: match[1], resourceSlug: match[2] }));
  assert.equal(coloring.length, publishedBooks.length);

  for (const entry of coloring) {
    const book = publishedBooks.find((candidate) => candidate.number === entry.number);
    assert.ok(book, entry.number);
    if (entry.resourceSlug === book.slug) {
      assert.equal(bookAliases[entry.resourceSlug], undefined);
      continue;
    }
    assert.equal(bookAliases[entry.resourceSlug], book.slug);
  }
});

test("next.config redirects are permanent 301s plus the existing apex host redirect", async () => {
  const redirects = bookAliasRedirects();
  const aliases = Object.entries(bookAliases).sort(([left], [right]) =>
    left.localeCompare(right),
  );

  assert.equal(redirects.length, aliases.length);
  for (const [index, [alias, slug]] of aliases.entries()) {
    assert.deepEqual(redirects[index], {
      source: `/book/${alias}`,
      destination: `/book/${slug}`,
      statusCode: 301,
    });
  }

  const configured = await nextConfig.redirects();
  assert.deepEqual(configured.slice(0, redirects.length), redirects);
  assert.deepEqual(configured[configured.length - 1], {
    source: "/:path*",
    has: [{ type: "host", value: "faithfulheartsbooks.com" }],
    destination: "https://www.faithfulheartsbooks.com/:path*",
    permanent: true,
  });
  assert.equal(configured.length, redirects.length + 1);

  const sources = configured.map((redirect) => redirect.source);
  assert.equal(sources.includes("/book/zacchaeus"), false);
  assert.equal(sources.includes("/book/noah-and-gods-big-promise"), false);
  assert.equal(sources.includes("/book/moses-and-the-red-sea"), false);
  assert.equal(sources.includes("/book/paul-and-silas-in-prison"), false);
  assert.equal(sources.includes("/book/jesus-welcomes-children"), false);

  const bySource = Object.fromEntries(
    configured.map((redirect) => [redirect.source, redirect]),
  );
  assert.deepEqual(bySource["/book/moses"], {
    source: "/book/moses",
    destination: "/book/moses-and-the-red-sea",
    statusCode: 301,
  });
  assert.deepEqual(bySource["/book/paul"], {
    source: "/book/paul",
    destination: "/book/paul-and-silas-in-prison",
    statusCode: 301,
  });
  assert.deepEqual(bySource["/book/jesus"], {
    source: "/book/jesus",
    destination: "/book/jesus-welcomes-children",
    statusCode: 301,
  });
});
