import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const page = readFileSync(
  new URL("../src/pages/portfolio.astro", import.meta.url),
  "utf8"
);
const source = page.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(source);
const { outputText } = ts.transpileModule(
  source.replace(/^\s*import[^;]+;/m, ""),
  {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
    },
  }
);

function fixture({ missingDetails = false } = {}) {
  const controls = { hidden: true };
  const expand = new EventTarget();
  const details = Array.from({ length: 9 }, (_, index) => ({
    open: index === 0,
  }));
  const entries = details.map(detail => ({
    querySelector: () => (missingDetails ? null : detail),
  }));
  const registry = new Map();
  class Element extends EventTarget {
    querySelector(selector) {
      return selector === "[data-controls]" ? controls : expand;
    }
    querySelectorAll() {
      return entries;
    }
  }
  runInNewContext(outputText, {
    HTMLElement: Element,
    AbortController,
    customElements: {
      get: name => registry.get(name),
      define: (name, type) => registry.set(name, type),
    },
  });
  const Explorer = registry.get("portfolio-explorer");
  return { element: new Explorer(), controls, expand, details };
}

test("all roles expand/collapse and the control follows individual disclosures", () => {
  const f = fixture();
  f.element.connectedCallback();
  assert.equal(f.controls.hidden, false);
  assert.equal(f.expand.textContent, "Expand all roles");
  f.expand.dispatchEvent(new Event("click"));
  assert.equal(
    f.details.every(detail => detail.open),
    true
  );
  assert.equal(f.expand.textContent, "Collapse all roles");
  f.details[0].open = false;
  f.element.dispatchEvent(new Event("toggle"));
  assert.equal(f.expand.textContent, "Expand all roles");
  f.expand.dispatchEvent(new Event("click"));
  f.expand.dispatchEvent(new Event("click"));
  assert.equal(
    f.details.every(detail => !detail.open),
    true
  );
});

test("leaving removes bulk-action listeners and reconnecting installs them once", () => {
  const f = fixture();
  f.element.connectedCallback();
  f.element.disconnectedCallback();
  f.expand.dispatchEvent(new Event("click"));
  assert.equal(f.details.filter(detail => detail.open).length, 1);
  f.element.connectedCallback();
  f.element.connectedCallback();
  f.expand.dispatchEvent(new Event("click"));
  assert.equal(
    f.details.every(detail => detail.open),
    true
  );
});

test("broken role markup fails before exposing the enhanced controls", () => {
  const f = fixture({ missingDetails: true });
  assert.throws(() => f.element.connectedCallback(), /missing its details/);
  assert.equal(f.controls.hidden, true);
});
