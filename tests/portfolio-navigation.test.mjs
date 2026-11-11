import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const page = readFileSync(
  new URL("../src/pages/portfolio.astro", import.meta.url),
  "utf8"
);
const script = page.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script, "Portfolio must include its enhancement script");
const { outputText } = ts.transpileModule(script, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
  },
});

function navigationFixture({ missingTarget = false } = {}) {
  const sections = [{ top: 180 }, { top: 1000 }, { top: 1800 }];
  const links = sections.map((_, index) => ({
    hash: `#section-${index}`,
    attributes: new Map(),
    setAttribute(name, value) {
      this.attributes.set(name, value);
    },
    removeAttribute(name) {
      this.attributes.delete(name);
    },
  }));
  const frames = new Map();
  const observers = [];
  const registry = new Map();
  const window = new EventTarget();
  let frameId = 0;
  const main = {};
  class Element extends EventTarget {
    querySelectorAll() {
      return links;
    }
    closest() {
      return main;
    }
    getBoundingClientRect() {
      return { height: 48 };
    }
  }
  class Observer {
    constructor(callback) {
      this.callback = callback;
      observers.push(this);
    }
    observe(target) {
      this.target = target;
    }
    disconnect() {
      this.disconnected = true;
    }
  }
  runInNewContext(outputText, {
    HTMLElement: Element,
    AbortController,
    ResizeObserver: Observer,
    window,
    document: {
      getElementById(id) {
        if (missingTarget) return null;
        const section = sections[Number(id.split("-")[1])];
        return section
          ? { getBoundingClientRect: () => ({ top: section.top }) }
          : null;
      },
    },
    customElements: {
      get: name => registry.get(name),
      define: (name, constructor) => registry.set(name, constructor),
    },
    requestAnimationFrame(callback) {
      frames.set(++frameId, callback);
      return frameId;
    },
    cancelAnimationFrame(id) {
      frames.delete(id);
    },
  });
  const Navigation = registry.get("portfolio-navigation");
  const element = new Navigation();
  return {
    element,
    links,
    sections,
    window,
    observers,
    frames,
    current: () =>
      links.findIndex(
        link => link.attributes.get("aria-current") === "location"
      ),
    flush() {
      const callbacks = [...frames.values()];
      frames.clear();
      for (const callback of callbacks) callback();
    },
  };
}

test("marks exactly one current section when scrolling forward and back", () => {
  const f = navigationFixture();
  f.element.connectedCallback();
  assert.equal(f.current(), 0);
  f.sections[0].top = -1500;
  f.sections[1].top = -200;
  f.sections[2].top = 60;
  f.window.dispatchEvent(new Event("scroll"));
  f.flush();
  assert.equal(f.current(), 2);
  assert.equal(
    f.links.filter(link => link.attributes.has("aria-current")).length,
    1
  );
  f.sections[1].top = 200;
  f.sections[2].top = 1000;
  f.window.dispatchEvent(new Event("scroll"));
  f.flush();
  assert.equal(f.current(), 0);
  f.element.disconnectedCallback();
});

test("coalesces scroll updates and reacts to content layout changes", () => {
  const f = navigationFixture();
  f.element.connectedCallback();
  for (let i = 0; i < 10; i++) f.window.dispatchEvent(new Event("scroll"));
  assert.equal(f.frames.size, 1);
  f.flush();
  f.sections[1].top = 20;
  f.observers[0].callback();
  f.flush();
  assert.equal(f.current(), 1);
  f.element.disconnectedCallback();
});

test("releases observers, frames and listeners, then supports reconnection", () => {
  const f = navigationFixture();
  f.element.connectedCallback();
  f.window.dispatchEvent(new Event("scroll"));
  f.element.disconnectedCallback();
  assert.equal(f.frames.size, 0);
  assert.equal(f.observers[0].disconnected, true);
  f.window.dispatchEvent(new Event("scroll"));
  assert.equal(f.frames.size, 0);
  f.element.connectedCallback();
  f.sections[1].top = 20;
  f.window.dispatchEvent(new Event("resize"));
  f.flush();
  assert.equal(f.current(), 1);
  f.element.disconnectedCallback();
});

test("reports a broken section target instead of silently selecting a wrong link", () => {
  const f = navigationFixture({ missingTarget: true });
  assert.throws(
    () => f.element.connectedCallback(),
    /navigation target is missing/
  );
  f.element.disconnectedCallback();
});
