import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const { outputText } = ts.transpileModule(readFileSync(new URL("../src/scripts/article.ts", import.meta.url), "utf8"), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });

function fixture({ clipboardFails = false } = {}) {
  class Element extends EventTarget {
    style = {};
    dataset = {};
    attributes = {};
    children = [];
    textContent = "";
    setAttribute(name, value) { this.attributes[name] = value; }
    append(...children) { this.children.push(...children); }
  }
  const doc = new EventTarget();
  const win = new EventTarget();
  win.scrollY = 0;
  win.innerHeight = 600;
  const progress = new Element();
  const article = new Element();
  article.offsetHeight = 1500;
  article.getBoundingClientRect = () => ({ top: 100 - win.scrollY });
  const block = new Element();
  const code = new Element();
  code.textContent = "const answer = 42;";
  block.querySelector = () => code;
  block.before = wrapper => { block.parentElement = wrapper; };
  article.querySelectorAll = selector => selector === "pre" ? [block] : [];
  doc.querySelector = selector => selector === "#article" ? article : progress;
  const created = [];
  doc.createElement = () => { const element = new Element(); created.push(element); return element; };
  const frames = new Map();
  const timers = new Map();
  let sequence = 0;
  let disconnected = 0;
  const copies = [];
  runInNewContext(outputText, {
    document: doc, window: win, AbortController,
    navigator: { clipboard: { writeText: async value => { if (clipboardFails) throw new Error("Denied"); copies.push(value); } } },
    ResizeObserver: class { observe() {} disconnect() { disconnected++; } },
    requestAnimationFrame: callback => { frames.set(++sequence, callback); return sequence; },
    cancelAnimationFrame: id => frames.delete(id),
    setTimeout: callback => { timers.set(++sequence, callback); return sequence; },
    clearTimeout: id => timers.delete(id),
  });
  doc.dispatchEvent(new Event("astro:page-load"));
  return { doc, win, article, progress, created, frames, timers, copies, get disconnected() { return disconnected; } };
}

test("progress clamps to reading bounds, coalesces scrolls and cleans up on navigation", () => {
  const f = fixture();
  assert.equal(f.progress.style.transform, "scaleX(0)");
  f.win.scrollY = 500;
  f.win.dispatchEvent(new Event("scroll"));
  f.win.dispatchEvent(new Event("scroll"));
  assert.equal(f.frames.size, 1);
  const [id, callback] = [...f.frames][0];
  f.frames.delete(id);
  callback();
  assert.equal(f.progress.style.transform, "scaleX(0.5)");
  f.win.dispatchEvent(new Event("resize"));
  f.doc.dispatchEvent(new Event("astro:before-swap"));
  assert.equal(f.frames.size, 0);
  assert.equal(f.disconnected, 1);
  f.win.dispatchEvent(new Event("scroll"));
  assert.equal(f.frames.size, 0);
});

for (const fails of [false, true]) test(`copy ${fails ? "failure is announced" : "success preserves code text"} and timers clean up`, async () => {
  const f = fixture({ clipboardFails: fails });
  const button = f.created[1];
  const status = f.created[2];
  assert.equal(button.attributes["data-pagefind-ignore"], "");
  button.dispatchEvent(new Event("click"));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(button.textContent, fails ? "Retry" : "Copied");
  assert.match(status.textContent, fails ? /Copy failed/ : /Code copied/);
  assert.deepEqual(f.copies, fails ? [] : ["const answer = 42;"]);
  assert.equal(f.timers.size, 1);
  f.doc.dispatchEvent(new Event("astro:before-swap"));
  assert.equal(f.timers.size, 0);
});
