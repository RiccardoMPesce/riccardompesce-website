import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const css = readFileSync(
  new URL("../src/styles/theme.css", import.meta.url),
  "utf8"
);
function tokens(theme) {
  const block = css.match(
    new RegExp(`\\[data-theme="${theme}"\\] \\{([^}]+)`)
  )[1];
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[\da-f]{6})/gi)].map(match => [
      match[1],
      match[2],
    ])
  );
}
function luminance(hex) {
  const channels = [1, 3, 5].map(
    offset => parseInt(hex.slice(offset, offset + 2), 16) / 255
  );
  return channels
    .map(value =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    )
    .reduce(
      (sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index],
      0
    );
}
function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => a - b);
  return (values[1] + 0.05) / (values[0] + 0.05);
}
for (const theme of ["light", "dark"]) {
  test(`${theme}: text meets AA and primary reading text meets AAA on page, card and muted surfaces`, () => {
    const t = tokens(theme);
    for (const surface of ["background", "surface", "muted"]) {
      for (const token of [
        "foreground",
        "heading",
        "muted-foreground",
        "accent",
        "accent-hover",
      ]) {
        const ratio = contrast(t[token], t[surface]);
        assert.ok(
          ratio >= 4.5,
          `${token} on ${surface}: ${ratio.toFixed(2)}:1`
        );
        if (["foreground", "heading"].includes(token)) assert.ok(ratio >= 7);
      }
      assert.ok(contrast(t["input-border"], t[surface]) >= 3);
    }
    for (const token of ["accent", "accent-hover"])
      assert.ok(contrast(t[token], t["accent-foreground"]) >= 4.5);
    assert.ok(contrast(t.accent, t.background) >= 3);
    assert.ok(
      contrast(t.accent, t["accent-foreground"]) >= 7,
      "Selected text remains readable"
    );
  });
}
