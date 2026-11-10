import assert from "node:assert/strict";
import test from "node:test";
import { siteNavItems, siteNavLinkState } from "@/lib/site-nav";

const expected = [
  ["/", "Home"],
  ["/tonight", "Tonight"],
  ["/songs", "Songs"],
  ["/play", "Play"],
  ["/free-resources", "Free"],
  ["/churches", "Churches"],
  ["/shop", "Shop"],
] as const;

function activeLabels(pathname: string) {
  return siteNavLinkState(pathname).filter((link) => link.active).map((link) => link.label);
}

test("nav definition is the shared menu, in order", () => {
  assert.deepEqual(
    siteNavItems.map((item) => [item.href, item.label]),
    expected.map(([href, label]) => [href, label]),
  );
  assert.equal(siteNavItems.find((item) => item.href === "/")?.match, "exact");
  for (const item of siteNavItems) {
    if (item.href !== "/") assert.equal(item.match, "prefix");
  }
});

test("each nav item is the only highlight on its route, including nested routes", () => {
  const cases: { path: string; label: string }[] = [
    { path: "/", label: "Home" },
    { path: "/?ref=home", label: "Home" },
    { path: "/tonight", label: "Tonight" },
    { path: "/tonight/", label: "Tonight" },
    { path: "/tonight/print", label: "Tonight" },
    { path: "/songs", label: "Songs" },
    { path: "/songs?song=this-little-light-of-mine", label: "Songs" },
    { path: "/songs/extra", label: "Songs" },
    { path: "/play", label: "Play" },
    { path: "/play/", label: "Play" },
    { path: "/play/album", label: "Play" },
    { path: "/free-resources", label: "Free" },
    { path: "/free-resources/", label: "Free" },
    { path: "/free-resources/coloring-pages", label: "Free" },
    { path: "/churches", label: "Churches" },
    { path: "/churches/share", label: "Churches" },
    { path: "/shop", label: "Shop" },
    { path: "/shop/", label: "Shop" },
    { path: "/shop/tees", label: "Shop" },
  ];

  for (const { path, label } of cases) {
    const links = siteNavLinkState(path);
    assert.deepEqual(
      links.map((link) => link.label),
      expected.map(([, itemLabel]) => itemLabel),
      path,
    );
    assert.deepEqual(activeLabels(path), [label], path);
    assert.equal(links.filter((link) => link.active).length, 1, path);
  }
});

test("Home is only exact, and non-nav pages highlight nothing", () => {
  for (const path of [
    "/about",
    "/book/zacchaeus",
    "/book/noah-and-gods-big-promise",
    "/contact",
    "/privacy",
    "/home",
    "/free",
    "/playground",
    "/shopping",
    "",
  ]) {
    assert.deepEqual(activeLabels(path), [], path);
  }
});
