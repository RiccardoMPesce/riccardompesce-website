import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { setImmediate } from "node:timers/promises";
import ts from "typescript";

const source = readFileSync(
  new URL("../src/scripts/search.ts", import.meta.url),
  "utf8"
);
const code = ts
  .transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
    },
  })
  .outputText.replace(
    'await import("@pagefind/default-ui")',
    "await loadPagefind()"
  );
function fixture({ failImport = false, delayed = false } = {}) {
  class Element extends EventTarget {
    attributes = new Map();
    dataset = {
      bundlePath: "/pagefind/",
      searchLabel: "Search articles",
      backurl: "/search/",
    };
    setAttribute(name, value) {
      this.attributes.set(name, value);
    }
    focus() {
      this.focused = true;
    }
    remove() {
      this.removed = true;
    }
    querySelector(selector) {
      return this.elements[selector];
    }
    replaceChildren(element) {
      this.failure = element;
    }
  }
  const registry = new Map();
  const instances = [];
  class PagefindUI {
    constructor(options) {
      this.options = options;
      this.terms = [];
      instances.push(this);
    }
    triggerSearch(term) {
      this.terms.push(term);
    }
    destroy() {
      this.destroyed = true;
    }
  }
  let resolveLoad;
  const load = delayed
    ? new Promise(resolve => {
        resolveLoad = resolve;
      })
    : Promise.resolve({ PagefindUI });
  const window = {
    location: {
      href: "https://example.org/search/?filter=notes&q=systems",
      pathname: "/search/",
    },
  };
  const history = {
    state: { router: true },
    replaceState: (state, _, url) => {
      history.url = url;
      history.lastState = state;
      window.location.href = "https://example.org" + url;
    },
  };
  runInNewContext(code, {
    HTMLElement: Element,
    AbortController,
    URL,
    window,
    history,
    sessionStorage: {
      setItem: () => {
        throw new Error("Storage denied");
      },
    },
    document: { createElement: () => new Element() },
    customElements: {
      get: name => registry.get(name),
      define: (name, constructor) => registry.set(name, constructor),
    },
    loadPagefind: () =>
      failImport ? Promise.reject(new Error("Network unavailable")) : load,
  });
  const element = new (registry.get("site-search"))();
  const input = new Element();
  input.value = "";
  const clear = new Element();
  const status = new Element();
  element.elements = {
    ".pagefind-ui__search-input": input,
    ".pagefind-ui__search-clear": clear,
    "[data-search-status]": status,
  };
  return {
    element,
    instances,
    input,
    clear,
    status,
    history,
    resolveLoad: () => resolveLoad({ PagefindUI }),
  };
}

test("Pagefind gets a named search input, deep-link query and storage-independent clearing", async () => {
  const f = fixture();
  f.element.connectedCallback();
  await setImmediate();
  assert.equal(f.input.attributes.get("aria-label"), "Search articles");
  assert.equal(f.input.attributes.get("type"), "search");
  assert.deepEqual(f.instances[0].terms, ["systems"]);
  f.clear.dispatchEvent(new Event("click"));
  assert.equal(f.history.url, "/search/?filter=notes");
  assert.equal(f.input.focused, true);
  assert.equal(f.status.removed, true);
});

test("failed UI imports present an alert instead of an endless loading state", async () => {
  const f = fixture({ failImport: true });
  f.element.connectedCallback();
  await setImmediate();
  assert.equal(f.element.failure.attributes.get("role"), "alert");
  assert.match(f.element.failure.textContent, /could not load/);
});

test("navigation destroys Pagefind and aborts late imports and old listeners", async () => {
  const late = fixture({ delayed: true });
  late.element.connectedCallback();
  late.element.disconnectedCallback();
  late.resolveLoad();
  await setImmediate();
  assert.equal(late.instances.length, 0);
  const f = fixture();
  f.element.connectedCallback();
  await setImmediate();
  f.element.disconnectedCallback();
  assert.equal(f.instances[0].destroyed, true);
  f.clear.dispatchEvent(new Event("click"));
  assert.equal(f.history.url, undefined);
  f.element.connectedCallback();
  await setImmediate();
  assert.equal(f.instances.length, 2);
});
