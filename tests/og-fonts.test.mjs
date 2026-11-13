import assert from "node:assert/strict";
import { test } from "node:test";
import { loadOgFonts } from "../src/utils/loadOgFonts.ts";
import satori from "satori";
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

test("local OG fonts render regular, bold and Italian text without network access", async () => {
  const [regular, bold] = await loadOgFonts();
  assert.equal(regular.subarray(0, 4).toString(), "wOFF");
  assert.equal(bold.subarray(0, 4).toString(), "wOFF");
  const svg = await satori({
    type: "div",
    props: { style: { display: "flex" }, children: [
      { type: "span", props: { children: "Ingegneria, città e perché" } },
      { type: "strong", props: { children: "Autorità" } },
    ] },
  }, {
    width: 1200, height: 630,
    fonts: [
      { name: "Inter", data: regular, weight: 400, style: "normal" },
      { name: "Inter", data: bold, weight: 700, style: "normal" },
    ],
  });
  assert.match(svg, /<svg/);
  assert.match(svg, /<path/);
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
