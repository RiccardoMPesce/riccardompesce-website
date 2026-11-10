import assert from "node:assert/strict";
import { test } from "node:test";
import config from "../astro.config.mjs";
import { getFontPathByWeight } from "../src/utils/getFontPathByWeight.ts";

const fonts = [
  {
    weight: "400",
    style: "normal",
    src: [
      { url: "/regular.woff", format: "woff" },
      { url: "/regular.ttf", format: "truetype" },
    ],
  },
  {
    weight: "700",
    style: "normal",
    src: [{ url: "/bold.ttf", format: "truetype" }],
  },
  {
    weight: "400",
    style: "italic",
    src: [{ url: "/italic.ttf", format: "truetype" }],
  },
];

test("the default Astro config registers both OG weights in a Satori-compatible format", () => {
  const family = config.fonts.find(
    font => font.cssVariable === "--font-google-sans-code"
  );
  assert.ok(family);
  assert.ok(family.weights.includes(400));
  assert.ok(family.weights.includes(700));
  assert.ok(family.styles.includes("normal"));
  assert.ok(family.formats.includes("ttf"));
});

test("selects regular and bold TTF sources, with explicit style and format overrides", () => {
  assert.equal(getFontPathByWeight(fonts, 400), "/regular.ttf");
  assert.equal(getFontPathByWeight(fonts, 700), "/bold.ttf");
  assert.equal(
    getFontPathByWeight(fonts, 400, { style: "italic" }),
    "/italic.ttf"
  );
  assert.equal(
    getFontPathByWeight(fonts, 400, { format: "woff" }),
    "/regular.woff"
  );
});

test("falls back to the first source when the preferred format is unavailable", () => {
  assert.equal(
    getFontPathByWeight(fonts, 700, { format: "woff" }),
    "/bold.ttf"
  );
});

test("handles empty metadata, missing weights and missing sources", () => {
  assert.equal(getFontPathByWeight([], 400), undefined);
  assert.equal(getFontPathByWeight(fonts, 500), undefined);
  assert.equal(
    getFontPathByWeight([{ weight: "400", style: "normal", src: [] }], 400),
    undefined
  );
});

test("reports a missing font registration with an actionable error", () => {
  assert.throws(
    () => getFontPathByWeight(undefined, 400),
    /Font family is not registered.*astro\.config\.mjs/
  );
});
