import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { createContext, runInContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(
  new URL("../src/scripts/theme.ts", import.meta.url),
  "utf8"
);
const layout = readFileSync(
  new URL("../src/layouts/Layout.astro", import.meta.url),
  "utf8"
);
const bootstrap = layout.match(/<script is:inline>([\s\S]*?)<\/script>/)?.[1];
assert.ok(bootstrap, "Theme must be applied before the first paint");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
  },
});

function fixture({
  dark = false,
  values = new Map(),
  blockRead = false,
  blockWrite = false,
} = {}) {
  class Element extends EventTarget {
    attributes = new Map();
    style = {};
    classes = new Set();
    classList = {
      toggle: (name, enabled) =>
        enabled ? this.classes.add(name) : this.classes.delete(name),
    };
    setAttribute(name, value) {
      this.attributes.set(name, value);
    }
    getAttribute(name) {
      return this.attributes.get(name) ?? null;
    }
  }
  const media = new EventTarget();
  media.matches = dark;
  const win = new EventTarget();
  win.matchMedia = () => media;
  let button = new Element();
  let meta = new Element();
  const doc = new EventTarget();
  doc.documentElement = new Element();
  doc.body = {};
  doc.querySelector = selector => (selector === "#theme-btn" ? button : meta);
  win.getComputedStyle = () => ({
    backgroundColor:
      doc.documentElement.getAttribute("data-theme") === "dark"
        ? "rgb(25, 25, 25)"
        : "rgb(255, 255, 255)",
  });
  const context = createContext({
    window: win,
    document: doc,
    AbortController,
    localStorage: {
      getItem(key) {
        if (blockRead) throw new Error("Storage denied");
        return values.get(key) ?? null;
      },
      setItem(key, value) {
        if (blockWrite) throw new Error("Storage denied");
        values.set(key, value);
      },
    },
  });
  runInContext(bootstrap, context);
  const initial = doc.documentElement.getAttribute("data-theme");
  runInContext(outputText, context);
  return {
    values,
    media,
    win,
    doc,
    initial,
    current: () => doc.documentElement.getAttribute("data-theme"),
    click: () => button.dispatchEvent(new Event("click")),
    systemChange(matches) {
      media.matches = matches;
      media.dispatchEvent(new Event("change"));
    },
    storage(value) {
      if (value === null) values.delete("theme");
      else values.set("theme", value);
      const event = new Event("storage");
      Object.defineProperty(event, "key", { value: "theme" });
      win.dispatchEvent(event);
    },
    swap() {
      const next = {
        documentElement: new Element(),
        querySelector: () => nextMeta,
      };
      const nextMeta = new Element();
      const event = new Event("astro:before-swap");
      Object.defineProperty(event, "newDocument", { value: next });
      doc.dispatchEvent(event);
      assert.equal(
        nextMeta.getAttribute("content"),
        meta.getAttribute("content")
      );
      assert.equal(
        next.documentElement.getAttribute("data-theme"),
        this.current()
      );
      doc.documentElement = next.documentElement;
      button = new Element();
      meta = nextMeta;
      doc.dispatchEvent(new Event("astro:after-swap"));
    },
  };
}

test("first paint and runtime default to the system without saving an inferred preference", () => {
  for (const dark of [false, true]) {
    const f = fixture({ dark });
    assert.equal(f.initial, dark ? "dark" : "light");
    assert.equal(f.current(), f.initial);
    assert.equal(f.doc.documentElement.style.colorScheme, f.current());
    assert.equal(f.values.size, 0);
  }
});

test("system changes remain automatic until an explicit choice", () => {
  const f = fixture();
  f.systemChange(true);
  assert.equal(f.current(), "dark");
  f.systemChange(false);
  assert.equal(f.current(), "light");
  assert.equal(f.values.size, 0);
});

test("a chosen theme persists across visits and subsequent OS changes cannot overwrite it", () => {
  const values = new Map();
  const f = fixture({ values });
  f.click();
  assert.equal(f.current(), "dark");
  assert.equal(values.get("theme"), "dark");
  f.systemChange(true);
  f.systemChange(false);
  assert.equal(f.current(), "dark");
  assert.equal(values.get("theme"), "dark");
  const next = fixture({ values, dark: false });
  assert.equal(next.initial, "dark");
  next.click();
  assert.equal(values.get("theme"), "light");
  next.systemChange(true);
  assert.equal(next.current(), "light");
});

test("invalid saved values fall back consistently in bootstrap and runtime", () => {
  for (const value of ["auto", "sepia", "", "undefined"]) {
    const f = fixture({ dark: true, values: new Map([["theme", value]]) });
    assert.equal(f.initial, "dark");
    assert.equal(f.current(), "dark");
    f.systemChange(false);
    assert.equal(f.current(), "light");
  }
});

test("Astro swaps carry the explicit theme and rebind a single toggle listener", () => {
  const f = fixture();
  f.click();
  f.swap();
  assert.equal(f.current(), "dark");
  f.doc.dispatchEvent(new Event("astro:after-swap"));
  f.doc.dispatchEvent(new Event("astro:after-swap"));
  f.click();
  assert.equal(f.current(), "light");
  assert.equal(f.values.get("theme"), "light");
});

test("other tabs update the saved choice, and removing it resumes system behavior", () => {
  const f = fixture();
  f.storage("dark");
  assert.equal(f.current(), "dark");
  f.systemChange(false);
  assert.equal(f.current(), "dark");
  f.storage(null);
  assert.equal(f.current(), "light");
  f.systemChange(true);
  assert.equal(f.current(), "dark");
});

test("blocked storage does not break initial rendering or the in-memory choice", () => {
  const f = fixture({ dark: true, blockRead: true, blockWrite: true });
  assert.equal(f.initial, "dark");
  assert.equal(f.current(), "dark");
  f.click();
  assert.equal(f.current(), "light");
  f.systemChange(true);
  assert.equal(f.current(), "light");
  f.swap();
  assert.equal(f.current(), "light");
  assert.equal(f.values.size, 0);
});

test("write failures retain the explicit preference for the current visit", () => {
  const f = fixture({ blockWrite: true });
  f.click();
  f.systemChange(false);
  assert.equal(f.current(), "dark");
  assert.equal(f.values.size, 0);
});
