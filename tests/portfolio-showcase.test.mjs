import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { test } from "node:test";
import ts from "typescript";

const { outputText } = ts.transpileModule(readFileSync(new URL("../src/scripts/portfolio-showcase.ts", import.meta.url), "utf8"), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
function fixture({ reduced = false, count = 4, broken = false } = {}) {
  class Element extends EventTarget {
    hidden = false;
    inert = false;
    attributes = new Map();
    setAttribute(key, value) { this.attributes.set(key, value); }
    contains(node) { return node === this || [...Object.values(nodes), ...slides, ...dots].includes(node); }
  }
  const nodes = Object.fromEntries(["showcase", "full-portfolio", "showcase-toggle", "showcase-prev", "showcase-next", "showcase-pause", "showcase-status"].map(name => [`[data-${name}]`, new Element()]));
  const slides = Array.from({ length: count }, () => new Element());
  const dots = Array.from({ length: count }, () => new Element());
  const media = new EventTarget(); media.matches = reduced;
  const doc = new EventTarget(); doc.hidden = false;
  const timers = new Map();
  let time = 0; let sequence = 0; let definition;
  const context = {
    HTMLElement: class extends Element {
      querySelector(selector) { return nodes[selector]; }
      querySelectorAll(selector) { return selector === "[data-showcase-slide]" ? slides : broken ? [] : dots; }
    },
    Node: Element, AbortController, document: doc, matchMedia: () => media,
    customElements: { get() {}, define(_name, value) { definition = value; } },
    location: { href: "https://example.com/portfolio/" }, URL,
    performance: { now: () => time },
    setTimeout(callback, delay) { timers.set(++sequence, { callback, at: time + delay }); return sequence; },
    clearTimeout(id) { timers.delete(id); },
  };
  runInNewContext(outputText, context);
  const element = new definition();
  const advance = duration => {
    const end = time + duration;
    while (true) {
      const pending = [...timers].sort((a,b) => a[1].at - b[1].at)[0];
      if (!pending || pending[1].at > end) break;
      time = pending[1].at; timers.delete(pending[0]); pending[1].callback();
    }
    time = end;
  };
  return { element, nodes, slides, dots, doc, media, timers, advance, selected: () => slides.findIndex(slide => !slide.hidden) };
}
const click = node => node.dispatchEvent(new Event("click"));

test("one compact case rotates every six seconds, wraps, and keeps full text mounted", () => {
  const f = fixture(); f.element.connectedCallback();
  assert.equal(f.nodes["[data-full-portfolio]"].hidden, true);
  assert.equal(f.selected(), 0);
  f.advance(5999); assert.equal(f.selected(), 0);
  f.advance(1); assert.equal(f.selected(), 1);
  f.advance(18000); assert.equal(f.selected(), 0);
  assert.equal(f.slides.filter(slide => !slide.inert).length, 1);
  click(f.nodes["[data-showcase-toggle]"]);
  assert.equal(f.nodes["[data-full-portfolio]"].hidden, false);
  assert.equal(f.nodes["[data-showcase]"].hidden, true);
  assert.equal(f.nodes["[data-showcase-toggle]"].textContent, "Back to Compact Showcase");
  assert.equal(f.timers.size, 0);
  click(f.nodes["[data-showcase-toggle]"]);
  assert.equal(f.timers.size, 1);
});

test("hover pauses remaining time; focus, page visibility and explicit pause compose", () => {
  const f = fixture(); f.element.connectedCallback();
  f.advance(2000);
  f.nodes["[data-showcase]"].dispatchEvent(new Event("mouseenter"));
  f.advance(20000); assert.equal(f.selected(), 0);
  f.nodes["[data-showcase]"].dispatchEvent(new Event("mouseleave"));
  f.advance(3999); assert.equal(f.selected(), 0);
  f.advance(1); assert.equal(f.selected(), 1);
  f.nodes["[data-showcase]"].dispatchEvent(new Event("focusin"));
  f.advance(10000); assert.equal(f.selected(), 1);
  f.nodes["[data-showcase]"].dispatchEvent(new Event("focusout"));
  click(f.nodes["[data-showcase-pause]"]);
  assert.equal(f.timers.size, 0);
  click(f.nodes["[data-showcase-pause]"]);
  f.doc.hidden = true; f.doc.dispatchEvent(new Event("visibilitychange"));
  assert.equal(f.timers.size, 0);
  f.doc.hidden = false; f.doc.dispatchEvent(new Event("visibilitychange"));
  assert.equal(f.timers.size, 1);
});

test("manual controls wrap, dots select, keyboard works and reduced motion disables autoplay", () => {
  const f = fixture({ reduced: true }); f.element.connectedCallback();
  assert.equal(f.timers.size, 0);
  click(f.nodes["[data-showcase-prev]"]); assert.equal(f.selected(), 3);
  click(f.nodes["[data-showcase-next]"]); assert.equal(f.selected(), 0);
  click(f.dots[2]); assert.equal(f.selected(), 2);
  const event = new Event("keydown", { cancelable: true });
  Object.defineProperty(event, "key", { value: "ArrowRight" });
  f.nodes["[data-showcase]"].dispatchEvent(event);
  assert.equal(f.selected(), 3); assert.equal(event.defaultPrevented, true);
  assert.equal(f.timers.size, 0);
  f.media.matches = false; f.media.dispatchEvent(new Event("change"));
  assert.equal(f.timers.size, 1);
});

test("disconnect clears timers and listeners; reconnect schedules only one rotation", () => {
  const f = fixture(); f.element.connectedCallback();
  f.element.disconnectedCallback(); assert.equal(f.timers.size, 0);
  click(f.nodes["[data-showcase-next]"]); assert.equal(f.selected(), 0);
  f.element.connectedCallback(); f.element.connectedCallback();
  assert.equal(f.timers.size, 1);
  click(f.nodes["[data-showcase-next]"]); assert.equal(f.selected(), 1);
});

test("invalid markup fails before hiding the full portfolio", () => {
  const f = fixture({ broken: true });
  assert.throws(() => f.element.connectedCallback(), /matching slides/);
  assert.equal(f.nodes["[data-full-portfolio]"].hidden, false);
});
