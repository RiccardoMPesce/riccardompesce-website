import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(
  new URL("../src/scripts/portfolio-tabs.ts", import.meta.url),
  "utf8"
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
  },
});

function fixture({
  url = "https://example.com/portfolio/",
  wide = true,
  missingPanel = false,
  reducedMotion = false,
} = {}) {
  const registry = new Map();
  const targets = new Map();
  const doc = {
    activeElement: null,
    getElementById: id => targets.get(id) ?? null,
  };
  class Element extends EventTarget {
    attributes = new Map();
    properties = new Map();
    style = { setProperty: (name, value) => this.properties.set(name, value) };
    rect = { top: 0, height: 100 };
    children = [];
    hidden = false;
    parentElement = null;
    constructor(id = "") {
      super();
      this.id = id;
    }
    setAttribute(name, value) {
      this.attributes.set(name, value);
    }
    getAttribute(name) {
      return this.attributes.get(name) ?? null;
    }
    removeAttribute(name) {
      this.attributes.delete(name);
    }
    hasAttribute(name) {
      return this.attributes.has(name);
    }
    toggleAttribute(name, value) {
      if (value) this.setAttribute(name, "");
      else this.removeAttribute(name);
    }
    getBoundingClientRect() {
      return this.rect;
    }
    set tabIndex(value) {
      this.setAttribute("tabindex", String(value));
    }
    get tabIndex() {
      return Number(this.getAttribute("tabindex"));
    }
    focus() {
      doc.activeElement = this;
    }
    scrollIntoView() {
      this.scrolled = true;
    }
    contains(target) {
      return (
        this === target || this.children.some(child => child.contains(target))
      );
    }
    closest() {
      return this.hash ? this : null;
    }
    querySelector(selector) {
      return this.lookup?.[selector] ?? null;
    }
    querySelectorAll() {
      return this.children;
    }
  }
  class Details extends Element {
    open = false;
  }
  const list = new Element();
  const toggle = new Element();
  const navigation = new Element();
  const bar = new Element();
  const sentinel = new Element();
  sentinel.rect.top = 100;
  bar.getBoundingClientRect = () => ({
    top: 0,
    height: navigation.hasAttribute("data-stuck") ? 53 : 130,
  });
  toggle.hidden = true;
  const panels = ["summary", "experience", "education"].map((id, index) => {
    const panel = new Element(id);
    panel.rect.top = 200 + index * 1000;
    panel.setAttribute("aria-labelledby", `${id}-title`);
    targets.set(id, panel);
    return panel;
  });
  const links = panels.map(panel => {
    const link = new Element(`tab-${panel.id}`);
    link.hash = `#${panel.id}`;
    return link;
  });
  list.children = links;
  const details = new Details();
  details.parentElement = panels[2];
  const nested = new Element("thesis-result");
  nested.rect.top = 2400;
  nested.parentElement = details;
  details.children = [nested];
  panels[2].children = [details];
  targets.set(nested.id, nested);
  const media = new EventTarget();
  media.matches = wide;
  const motion = new EventTarget();
  motion.matches = reducedMotion;
  const frames = new Map();
  const observers = [];
  let frameId = 0;
  class Observer {
    constructor(callback) {
      this.callback = callback;
      observers.push(this);
    }
    observe() {}
    disconnect() {
      this.disconnected = true;
    }
  }
  const win = new EventTarget();
  win.scrollY = 0;
  win.scrolls = [];
  win.scrollTo = options => win.scrolls.push(options);
  const historyEntries = [];
  const setLocation = next => {
    const parsed = new URL(next);
    win.location = { href: parsed.href, hash: parsed.hash };
  };
  setLocation(url);
  win.matchMedia = query => (query.includes("reduced-motion") ? motion : media);
  win.history = {
    state: { router: "preserved" },
    pushState(state, _, next) {
      historyEntries.push({ state, url: next.href });
      setLocation(next);
    },
    replaceState(_state, _, next) {
      setLocation(next);
    },
  };
  runInNewContext(outputText, {
    HTMLElement: Element,
    HTMLDetailsElement: Details,
    Element,
    AbortController,
    ResizeObserver: Observer,
    requestAnimationFrame(callback) {
      frames.set(++frameId, callback);
      return frameId;
    },
    cancelAnimationFrame(id) {
      frames.delete(id);
    },
    URL,
    window: win,
    document: doc,
    customElements: {
      get: name => registry.get(name),
      define: (name, type) => registry.set(name, type),
    },
  });
  const Tabs = registry.get("portfolio-tabs");
  const element = new Tabs();
  element.lookup = {
    "[data-tablist]": list,
    "[data-view-all]": toggle,
    "[data-section-navigation]": navigation,
    "[data-navigation-bar]": bar,
    "[data-navigation-sentinel]": sentinel,
  };
  element.children = panels;
  if (missingPanel) targets.delete("education");
  if (missingPanel) element.children = panels.slice(0, 2);
  for (const panel of panels) panel.parentElement = element;
  // In a browser links belong to the element as well as their tablist.
  element.contains = target =>
    links.includes(target) || panels.some(panel => panel.contains(target));
  function dispatch(target, receiver, type, properties = {}) {
    const event = new Event(type, { cancelable: true });
    for (const [name, value] of Object.entries({ target, ...properties })) {
      Object.defineProperty(event, name, { value });
    }
    receiver.dispatchEvent(event);
    return event;
  }
  return {
    element,
    links,
    panels,
    list,
    toggle,
    media,
    win,
    details,
    nested,
    doc,
    historyEntries,
    navigation,
    bar,
    sentinel,
    frames,
    observers,
    flush() {
      const callbacks = [...frames.values()];
      frames.clear();
      for (const callback of callbacks) callback();
    },
    connect: () => element.connectedCallback(),
    click: (index, properties = {}) =>
      dispatch(links[index], element, "click", { button: 0, ...properties }),
    key: (index, key) => dispatch(links[index], list, "keydown", { key }),
    toggleAll: () => toggle.dispatchEvent(new Event("click")),
    navigate(next) {
      setLocation(next);
      win.dispatchEvent(new Event("popstate"));
    },
  };
}

function visible(f) {
  return f.panels.filter(panel => !panel.hidden).map(panel => panel.id);
}

test("progressive enhancement shows only Summary and exposes linked tab semantics", () => {
  const f = fixture();
  assert.equal(
    f.panels.every(panel => !panel.hidden),
    true
  );
  assert.equal(f.toggle.hidden, true);
  f.connect();
  assert.deepEqual(visible(f), ["summary"]);
  assert.equal(f.toggle.hidden, false);
  assert.equal(f.list.getAttribute("role"), "tablist");
  assert.equal(f.links[0].getAttribute("aria-selected"), "true");
  assert.equal(f.links[1].tabIndex, -1);
  assert.equal(f.links[0].getAttribute("aria-controls"), "summary");
  assert.equal(f.panels[0].getAttribute("aria-labelledby"), "tab-summary");
});

test("click switches panels and preserves router state in a shareable URL", () => {
  const f = fixture();
  f.connect();
  f.click(1);
  assert.deepEqual(visible(f), ["experience"]);
  assert.equal(f.win.location.hash, "#experience");
  assert.equal(f.historyEntries[0].state.router, "preserved");
  assert.equal(
    f.links.filter(link => link.getAttribute("aria-selected") === "true")
      .length,
    1
  );
  assert.equal(f.click(2, { ctrlKey: true }).defaultPrevented, false);
  assert.deepEqual(visible(f), ["experience"]);
});

test("desktop keyboard wraps, supports Home/End and leaves vertical scrolling alone", () => {
  const f = fixture();
  f.connect();
  assert.equal(f.key(0, "ArrowDown").defaultPrevented, false);
  f.key(0, "ArrowLeft");
  assert.deepEqual(visible(f), ["education"]);
  assert.equal(f.doc.activeElement, f.links[2]);
  f.key(2, "Home");
  assert.deepEqual(visible(f), ["summary"]);
  f.key(0, "End");
  f.key(2, "ArrowRight");
  assert.deepEqual(visible(f), ["summary"]);
});

test("mobile uses vertical keyboard navigation and responds to breakpoint changes", () => {
  const f = fixture({ wide: false });
  f.connect();
  assert.equal(f.list.getAttribute("aria-orientation"), "vertical");
  assert.equal(f.key(0, "ArrowRight").defaultPrevented, false);
  f.key(0, "ArrowDown");
  assert.deepEqual(visible(f), ["experience"]);
  f.key(1, "ArrowUp");
  assert.deepEqual(visible(f), ["summary"]);
  f.media.matches = true;
  f.media.dispatchEvent(new Event("change"));
  assert.equal(f.list.getAttribute("aria-orientation"), "horizontal");
});

test("full CV mode exposes all sections, restores document semantics and is shareable", () => {
  const f = fixture();
  f.connect();
  f.click(1);
  f.toggleAll();
  assert.equal(visible(f).length, 3);
  assert.equal(f.list.getAttribute("role"), null);
  assert.equal(f.panels[0].getAttribute("role"), null);
  assert.equal(f.panels[0].getAttribute("aria-labelledby"), "summary-title");
  assert.equal(f.links[0].getAttribute("tabindex"), null);
  assert.equal(new URL(f.win.location.href).searchParams.get("view"), "all");
  assert.equal(f.toggle.getAttribute("aria-pressed"), "true");
  f.toggleAll();
  assert.deepEqual(visible(f), ["experience"]);
  assert.equal(new URL(f.win.location.href).searchParams.has("view"), false);
  const full = fixture({
    url: "https://example.com/portfolio/?view=all#education",
  });
  full.connect();
  assert.equal(visible(full).length, 3);
});

test("deep links and history reveal the correct panel and nested disclosures", () => {
  const f = fixture({ url: "https://example.com/portfolio/#thesis-result" });
  f.connect();
  assert.deepEqual(visible(f), ["education"]);
  assert.equal(f.details.open, true);
  assert.equal(f.win.scrolls.at(-1).top, 2331);
  assert.equal(f.win.scrolls.at(-1).behavior, "instant");
  f.navigate("https://example.com/portfolio/#experience");
  assert.deepEqual(visible(f), ["experience"]);
  f.navigate("https://example.com/portfolio/");
  assert.deepEqual(visible(f), ["summary"]);
  f.navigate("https://example.com/portfolio/#%E0%A4%A");
  assert.deepEqual(visible(f), ["summary"]);
});

test("navigation cleanup removes listeners and reconnection does not duplicate them", () => {
  const f = fixture();
  f.connect();
  f.element.disconnectedCallback();
  f.click(1);
  assert.equal(f.historyEntries.length, 0);
  f.connect();
  f.connect();
  f.click(2);
  assert.equal(f.historyEntries.length, 1);
  assert.deepEqual(visible(f), ["education"]);
});

test("broken panel links fail before hiding any content", () => {
  const f = fixture({ missingPanel: true });
  assert.throws(f.connect, /target or label is missing/);
  assert.equal(
    f.panels.every(panel => !panel.hidden),
    true
  );
});

test("full CV section clicks scroll smoothly in either direction and retain the full document", () => {
  const f = fixture();
  f.connect();
  f.toggleAll();
  const down = f.click(2);
  assert.equal(down.defaultPrevented, true);
  assert.equal(visible(f).length, 3);
  assert.equal(new URL(f.win.location.href).searchParams.get("view"), "all");
  assert.equal(f.win.scrolls.at(-1).behavior, "smooth");
  assert.equal(f.win.scrolls.at(-1).top, 2131);
  f.win.scrollY = 3000;
  for (const panel of f.panels) panel.rect.top -= 3000;
  f.sentinel.rect.top = -2900;
  f.click(0);
  assert.equal(f.win.scrolls.at(-1).top, 131);
  assert.equal(f.win.scrolls.at(-1).behavior, "smooth");
  assert.equal(visible(f).length, 3);
  assert.equal(f.doc.activeElement, f.panels[0]);
});

test("reduced motion uses immediate scrolling, including mobile section links", () => {
  const f = fixture({ wide: false, reducedMotion: true });
  f.connect();
  f.toggleAll();
  f.click(1);
  assert.equal(f.win.scrolls.at(-1).behavior, "instant");
  assert.equal(f.win.scrolls.at(-1).top, 1184);
  assert.equal(f.navigation.hasAttribute("data-stuck"), false);
});

test("sticky navigation compacts only on desktop and reserves its expanded height", () => {
  const f = fixture();
  f.connect();
  assert.equal(
    f.element.properties.get("--portfolio-expanded-navigation"),
    "130px"
  );
  f.sentinel.rect.top = -1;
  for (let index = 0; index < 10; index++)
    f.win.dispatchEvent(new Event("scroll"));
  assert.equal(f.frames.size, 1);
  f.flush();
  assert.equal(f.navigation.hasAttribute("data-stuck"), true);
  assert.equal(
    f.element.properties.get("--portfolio-expanded-navigation"),
    "130px"
  );
  assert.equal(f.element.properties.get("--portfolio-nav-offset"), "69px");
  f.media.matches = false;
  f.media.dispatchEvent(new Event("change"));
  f.flush();
  assert.equal(f.navigation.hasAttribute("data-stuck"), false);
  assert.equal(f.element.properties.get("--portfolio-nav-offset"), "16px");
});

test("full document scrolling marks the visible section without adding history entries", () => {
  const f = fixture();
  f.connect();
  f.toggleAll();
  const count = f.historyEntries.length;
  f.sentinel.rect.top = -500;
  f.panels[0].rect.top = -2000;
  f.panels[1].rect.top = -800;
  f.panels[2].rect.top = 30;
  f.win.dispatchEvent(new Event("scroll"));
  f.flush();
  assert.equal(f.links[2].getAttribute("aria-current"), "location");
  assert.equal(f.links[0].getAttribute("aria-current"), null);
  assert.equal(f.historyEntries.length, count);
});

test("navigation removal cancels pending scroll work and disconnects the size observer", () => {
  const f = fixture();
  f.connect();
  f.win.dispatchEvent(new Event("scroll"));
  assert.equal(f.frames.size, 1);
  f.element.disconnectedCallback();
  assert.equal(f.frames.size, 0);
  assert.equal(f.observers[0].disconnected, true);
  f.win.dispatchEvent(new Event("scroll"));
  assert.equal(f.frames.size, 0);
});
