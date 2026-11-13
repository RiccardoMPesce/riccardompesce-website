import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { test } from "node:test";

const layout = readFileSync(new URL("../src/layouts/Layout.astro", import.meta.url), "utf8");
const script = [...layout.matchAll(/<script is:inline>([\s\S]*?)<\/script>/g)].map(match => match[1]).find(value => value.includes('entry?.type'));
assert.ok(script);
for (const type of ["reload", "navigate", "back_forward"]) {
  test(`${type}: resets Astro coordinates only on refresh`, () => {
    const state = { index: 4, scrollX: 10, scrollY: 950, custom: "retained" };
    let nextUrl;
    const history = { state, scrollRestoration: "auto", replaceState(value, _title, url) { this.state = value; nextUrl = url.href; } };
    const window = new EventTarget();
    window.location = { href: "https://example.com/portfolio/?view=all#experience" };
    const scrolls = [];
    window.scrollTo = value => scrolls.push(value);
    runInNewContext(script, { performance: { getEntriesByType: () => [{ type }] }, history, window, URL });
    if (type === "reload") {
      assert.equal(history.state.scrollY, 0);
      assert.equal(history.state.scrollX, 0);
      assert.equal(history.state.index, 4);
      assert.equal(history.state.custom, "retained");
      assert.equal(nextUrl, "https://example.com/portfolio/?view=all");
      assert.equal(history.scrollRestoration, "manual");
      window.dispatchEvent(new Event("pageshow"));
      window.dispatchEvent(new Event("pageshow"));
      assert.equal(scrolls.length, 1);
      assert.equal(scrolls[0].top, 0);
    } else {
      assert.equal(history.state, state);
      assert.equal(nextUrl, undefined);
      assert.equal(scrolls.length, 0);
    }
  });
}
