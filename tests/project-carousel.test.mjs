import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(
  new URL("../src/scripts/project-carousel.ts", import.meta.url),
  "utf8"
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
  },
});
function fixture({
  count = 3,
  reduced = false,
  width = 600,
  broken = false,
} = {}) {
  const registry = new Map();
  const frames = new Map();
  const observers = [];
  let frame = 0;
  let focused;
  class Element extends EventTarget {
    attributes = new Map();
    hidden = true;
    scrollLeft = 0;
    scrolls = [];
    clientWidth = width;
    offsetWidth = 180;
    offsetLeft = 0;
    captures = new Set();
    setAttribute(name, value) {
      this.attributes.set(name, value);
    }
    getAttribute(name) {
      return this.attributes.get(name) ?? null;
    }
    removeAttribute(name) {
      this.attributes.delete(name);
    }
    setPointerCapture(id) {
      this.captures.add(id);
    }
    hasPointerCapture(id) {
      return this.captures.has(id);
    }
    releasePointerCapture(id) {
      this.captures.delete(id);
    }
    set tabIndex(value) {
      this.setAttribute("tabindex", String(value));
    }
    focus() {
      focused = this;
    }
    scrollTo(options) {
      this.scrolls.push(options);
      this.scrollLeft = options.left;
    }
    querySelector(selector) {
      return nodes[selector];
    }
    querySelectorAll(selector) {
      return selector === "[data-project-slide]" ? slides : buttons;
    }
  }
  const slides = Array.from({ length: count }, (_, index) => {
    const el = new Element();
    el.id = `slide-${index}`;
    return el;
  });
  const buttons = slides.map((slide, index) => {
    const button = new Element();
    button.id = `preview-${index}`;
    button.offsetLeft = index * 192;
    button.setAttribute("aria-controls", broken ? "missing" : slide.id);
    return button;
  });
  const selectors = [
    "viewport",
    "controls",
    "previews",
    "navigation",
    "previous",
    "next",
    "status",
    "preview-previous",
    "preview-next",
  ];
  const nodes = Object.fromEntries(
    selectors.map(name => [`[data-project-${name}]`, new Element()])
  );
  const viewport = nodes["[data-project-viewport]"];
  viewport.scrollWidth = count * width;
  const previews = nodes["[data-project-previews]"];
  previews.clientWidth = 360;
  previews.scrollWidth = count * 180 + Math.max(0, count - 1) * 12;
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
  win.matchMedia = () => ({ matches: reduced });
  runInNewContext(outputText, {
    HTMLElement: Element,
    AbortController,
    ResizeObserver: Observer,
    window: win,
    requestAnimationFrame(callback) {
      frames.set(++frame, callback);
      return frame;
    },
    cancelAnimationFrame(id) {
      frames.delete(id);
    },
    customElements: {
      get: name => registry.get(name),
      define: (name, type) => registry.set(name, type),
    },
  });
  const Carousel = registry.get("project-carousel");
  const element = new Carousel();
  return {
    element,
    slides,
    buttons,
    nodes,
    viewport,
    previews,
    frames,
    observers,
    win,
    pointer(target, type, properties = {}) {
      const event = new Event(type, { cancelable: true });
      for (const [name, value] of Object.entries({
        pointerType: "mouse",
        pointerId: 1,
        button: 0,
        clientX: 200,
        clientY: 0,
        ...properties,
      }))
        Object.defineProperty(event, name, { value });
      target.dispatchEvent(event);
      return event;
    },
    wheel(properties = {}) {
      const event = new Event("wheel", { cancelable: true });
      for (const [name, value] of Object.entries({
        deltaX: 0,
        deltaY: 0,
        deltaMode: 0,
        ...properties,
      }))
        Object.defineProperty(event, name, { value });
      previews.dispatchEvent(event);
      return event;
    },
    connect: () => element.connectedCallback(),
    select(index) {
      buttons[index].dispatchEvent(new Event("click"));
    },
    next() {
      nodes["[data-project-next]"].dispatchEvent(new Event("click"));
    },
    key(index, key) {
      const event = new Event("keydown", { cancelable: true });
      Object.defineProperty(event, "key", { value: key });
      buttons[index].dispatchEvent(event);
      return event;
    },
    focused: () => focused,
    selected: () =>
      buttons.findIndex(
        button => button.getAttribute("aria-selected") === "true"
      ),
    flush() {
      const callbacks = [...frames.values()];
      frames.clear();
      for (const callback of callbacks) callback();
    },
  };
}

test("carousel exposes one selected preview and keeps inactive slide links inert", () => {
  const f = fixture();
  f.connect();
  assert.equal(f.selected(), 0);
  assert.equal(f.nodes["[data-project-controls]"].hidden, false);
  assert.equal(f.slides[0].inert, false);
  assert.equal(f.slides[1].inert, true);
  assert.equal(f.slides[1].getAttribute("aria-hidden"), "true");
  assert.equal(f.slides[0].getAttribute("role"), "tabpanel");
  assert.equal(f.nodes["[data-project-previous]"].disabled, true);
  f.next();
  assert.equal(f.selected(), 1);
  assert.equal(f.viewport.scrolls.at(-1).left, 600);
  assert.equal(f.viewport.scrolls.at(-1).behavior, "smooth");
});

test("preview keyboard navigation wraps and reveals the focused preview horizontally", () => {
  const f = fixture();
  f.connect();
  f.key(0, "End");
  assert.equal(f.selected(), 2);
  assert.equal(f.focused(), f.buttons[2]);
  assert.ok(f.previews.scrollLeft > 0);
  assert.equal(f.nodes["[data-project-next]"].disabled, true);
  f.key(2, "ArrowRight");
  assert.equal(f.selected(), 0);
  f.key(0, "ArrowLeft");
  assert.equal(f.selected(), 2);
  f.key(2, "Home");
  assert.equal(f.selected(), 0);
  assert.equal(f.key(0, "ArrowDown").defaultPrevented, false);
});

test("touch or trackpad scrolling updates the preview with one animation frame", () => {
  const f = fixture();
  f.connect();
  f.viewport.scrollLeft = 1200;
  for (let i = 0; i < 10; i++) f.viewport.dispatchEvent(new Event("scroll"));
  assert.equal(f.frames.size, 1);
  f.flush();
  assert.equal(f.selected(), 2);
  assert.equal(f.nodes["[data-project-status]"].textContent, "Project 3 of 3");
});

test("a carousel initialized in a hidden portfolio panel aligns when revealed or resized", () => {
  const f = fixture({ width: 0 });
  f.connect();
  f.select(2);
  assert.equal(f.viewport.scrolls.length, 0);
  f.viewport.clientWidth = 320;
  f.observers[0].callback();
  assert.equal(f.viewport.scrolls.at(-1).left, 640);
  assert.equal(f.viewport.scrolls.at(-1).behavior, "instant");
  assert.equal(f.selected(), 2);
});

test("reduced motion skips animated scrolling and a single project disables redundant arrows", () => {
  const f = fixture({ reduced: true });
  f.connect();
  f.select(2);
  assert.equal(f.viewport.scrolls.at(-1).behavior, "instant");
  const single = fixture({ count: 1 });
  single.connect();
  assert.equal(single.nodes["[data-project-navigation]"].hidden, false);
  assert.equal(single.nodes["[data-project-previous]"].disabled, true);
  assert.equal(single.nodes["[data-project-next]"].disabled, true);
  assert.equal(single.nodes["[data-project-preview-previous]"].disabled, true);
  assert.equal(single.nodes["[data-project-preview-next]"].disabled, true);
  assert.equal(single.nodes["[data-project-controls]"].hidden, false);
});

test("invalid preview mapping fails before enabling the carousel", () => {
  const f = fixture({ broken: true });
  assert.throws(f.connect, /matching slide/);
  assert.equal(f.nodes["[data-project-controls]"].hidden, true);
  assert.equal(f.element.getAttribute("data-enhanced"), null);
});

test("navigation away removes listeners, observers and pending scroll work", () => {
  const f = fixture();
  f.connect();
  f.viewport.dispatchEvent(new Event("scroll"));
  f.element.disconnectedCallback();
  assert.equal(f.frames.size, 0);
  assert.equal(f.observers[0].disconnected, true);
  f.select(2);
  assert.equal(f.selected(), 0);
  f.connect();
  f.connect();
  const count = f.viewport.scrolls.length;
  f.next();
  assert.equal(f.viewport.scrolls.length, count + 1);
});

test("programmatic smooth scrolling keeps the chosen preview until the reader takes over", () => {
  const f = fixture();
  f.connect();
  f.select(2);
  f.viewport.scrollLeft = 600;
  f.viewport.dispatchEvent(new Event("scroll"));
  f.flush();
  assert.equal(f.selected(), 2);
  f.viewport.dispatchEvent(new Event("wheel"));
  f.viewport.dispatchEvent(new Event("scroll"));
  f.flush();
  assert.equal(f.selected(), 1);
});

test("preview arrows scroll only the preview strip and disable at its boundaries", () => {
  const f = fixture();
  f.connect();
  const previous = f.nodes["[data-project-preview-previous]"];
  const next = f.nodes["[data-project-preview-next]"];
  const slideScrolls = f.viewport.scrolls.length;
  assert.equal(previous.disabled, true);
  assert.equal(next.disabled, false);
  next.dispatchEvent(new Event("click"));
  assert.equal(f.previews.scrollLeft, 204);
  assert.equal(f.previews.scrolls.at(-1).behavior, "smooth");
  assert.equal(next.disabled, true);
  assert.equal(previous.disabled, false);
  assert.equal(f.selected(), 0);
  assert.equal(f.viewport.scrolls.length, slideScrolls);
  previous.dispatchEvent(new Event("click"));
  assert.equal(f.previews.scrollLeft, 0);
  assert.equal(previous.disabled, true);
});

test("preview arrows follow manual scrolling, resizing and reduced motion", () => {
  const f = fixture({ reduced: true });
  f.connect();
  f.nodes["[data-project-preview-next]"].dispatchEvent(new Event("click"));
  assert.equal(f.previews.scrolls.at(-1).behavior, "instant");
  f.previews.scrollLeft = 100;
  f.previews.dispatchEvent(new Event("scroll"));
  assert.equal(f.nodes["[data-project-preview-next]"].disabled, false);
  assert.equal(f.nodes["[data-project-preview-previous]"].disabled, false);
  f.previews.clientWidth = 800;
  f.previews.scrollLeft = 0;
  f.observers[0].callback();
  assert.equal(f.nodes["[data-project-preview-next]"].disabled, true);
  assert.equal(f.nodes["[data-project-preview-previous]"].disabled, true);
});

test("mouse dragging scrolls previews and suppresses the release click only after a real drag", () => {
  const f = fixture();
  f.connect();
  f.pointer(f.previews, "pointerdown");
  f.pointer(f.win, "pointermove", { clientX: 197 });
  assert.equal(f.previews.getAttribute("data-dragging"), null);
  f.pointer(f.win, "pointermove", { clientX: 50 });
  assert.equal(f.previews.scrollLeft, 150);
  assert.equal(f.previews.hasPointerCapture(1), true);
  f.pointer(f.win, "pointerup", { clientX: 50 });
  assert.equal(f.previews.hasPointerCapture(1), false);
  assert.equal(f.previews.getAttribute("data-dragging"), null);
  const click = new Event("click", { cancelable: true });
  Object.defineProperty(click, "detail", { value: 1 });
  f.previews.dispatchEvent(click);
  assert.equal(click.defaultPrevented, true);
  assert.equal(f.selected(), 0);
  f.select(1);
  assert.equal(f.selected(), 1);
});

test("mouse dragging the project viewport updates its selected slide and cleans up on cancellation", () => {
  const f = fixture();
  f.connect();
  f.pointer(f.viewport, "pointerdown");
  f.pointer(f.win, "pointermove", { clientX: -500 });
  f.viewport.dispatchEvent(new Event("scroll"));
  f.flush();
  assert.equal(f.selected(), 1);
  f.pointer(f.win, "pointercancel");
  assert.equal(f.viewport.getAttribute("data-dragging"), null);
  assert.equal(f.viewport.hasPointerCapture(1), false);
});

test("mouse wheel scrolls the preview row only while it can consume that direction", () => {
  const f = fixture();
  f.connect();
  assert.equal(f.wheel({ deltaY: 100 }).defaultPrevented, true);
  assert.equal(f.previews.scrollLeft, 100);
  assert.equal(f.wheel({ deltaY: 1000 }).defaultPrevented, true);
  assert.equal(f.previews.scrollLeft, 204);
  assert.equal(f.wheel({ deltaY: 100 }).defaultPrevented, false);
  assert.equal(f.wheel({ deltaX: 50, deltaY: 0 }).defaultPrevented, false);
  assert.equal(f.wheel({ deltaY: -10, ctrlKey: true }).defaultPrevented, false);
  const single = fixture({ count: 1 });
  single.connect();
  assert.equal(single.wheel({ deltaY: 100 }).defaultPrevented, false);
});

test("touch retains native scrolling and disconnecting during a mouse drag releases capture", () => {
  const f = fixture();
  f.connect();
  f.pointer(f.previews, "pointerdown", { pointerType: "touch" });
  f.pointer(f.win, "pointermove", { pointerType: "touch", clientX: 20 });
  assert.equal(f.previews.scrollLeft, 0);
  f.pointer(f.previews, "pointerdown");
  f.pointer(f.win, "pointermove", { clientX: 50 });
  f.element.disconnectedCallback();
  assert.equal(f.previews.hasPointerCapture(1), false);
  assert.equal(f.previews.getAttribute("data-dragging"), null);
});
