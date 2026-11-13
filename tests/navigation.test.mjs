import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(
  new URL("../src/scripts/navigation.ts", import.meta.url),
  "utf8"
);
const code = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
  },
}).outputText;
function fixture() {
  class Element extends EventTarget {
    attributes = new Map();
    dataset = { labelOpen: "Open menu", labelClose: "Close menu" };
    classes = new Set();
    classList = {
      toggle: (name, enabled) =>
        enabled ? this.classes.add(name) : this.classes.delete(name),
    };
    setAttribute(name, value) {
      this.attributes.set(name, value);
    }
    getAttribute(name) {
      return this.attributes.get(name);
    }
    focus() {
      this.focused = true;
    }
  }
  const document = new EventTarget();
  const elements = Object.fromEntries(
    ["menu-btn", "menu-items", "menu-icon", "close-icon"].map(id => [
      id,
      new Element(),
    ])
  );
  document.querySelector = selector => elements[selector.slice(1)];
  runInNewContext(code, { document, AbortController });
  return { document, elements };
}

test("mobile menu reflects expanded state and Escape returns focus to its button", () => {
  const { elements } = fixture();
  const button = elements["menu-btn"];
  const items = elements["menu-items"];
  assert.equal(button.getAttribute("aria-expanded"), "false");
  button.dispatchEvent(new Event("click"));
  assert.equal(button.getAttribute("aria-expanded"), "true");
  assert.equal(button.getAttribute("aria-label"), "Close menu");
  assert.equal(items.classes.has("hidden"), false);
  items.dispatchEvent(Object.assign(new Event("keydown"), { key: "Escape" }));
  assert.equal(button.getAttribute("aria-expanded"), "false");
  assert.equal(button.focused, true);
});

test("Astro swaps bind only one listener and abort old navigation handlers", () => {
  const { document, elements } = fixture();
  const button = elements["menu-btn"];
  document.dispatchEvent(new Event("astro:after-swap"));
  document.dispatchEvent(new Event("astro:after-swap"));
  button.dispatchEvent(new Event("click"));
  assert.equal(button.getAttribute("aria-expanded"), "true");
  document.dispatchEvent(new Event("astro:before-swap"));
  button.dispatchEvent(new Event("click"));
  assert.equal(button.getAttribute("aria-expanded"), "true");
});

test("printing temporarily expands closed disclosures and restores the previous state", () => {
  const window = new EventTarget();
  const closed = [{ open: false }, { open: false }];
  const script = readFileSync(
    new URL("../src/scripts/print.ts", import.meta.url),
    "utf8"
  );
  const output = ts.transpileModule(script, {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText;
  runInNewContext(output, {
    window,
    document: { querySelectorAll: () => closed },
  });
  window.dispatchEvent(new Event("beforeprint"));
  assert.ok(closed.every(item => item.open));
  window.dispatchEvent(new Event("beforeprint"));
  window.dispatchEvent(new Event("afterprint"));
  assert.ok(closed.every(item => !item.open));
});
