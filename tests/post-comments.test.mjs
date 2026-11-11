import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const component = readFileSync(
  new URL("../src/components/PostComments.astro", import.meta.url),
  "utf8"
);
const source = component.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(source);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
  },
});

function fixture() {
  const button = new EventTarget();
  const status = {};
  const scripts = [];
  const messages = [];
  const root = { dataset: { theme: "light" } };
  const observers = [];
  const registry = new Map();
  class Element {
    dataset = {
      repository: "owner/blog",
      repositoryId: "R_example",
      category: "Comments",
      categoryId: "DIC_example",
    };
    querySelector(selector) {
      return {
        "[data-load-comments]": button,
        "[data-comments-status]": status,
        ".giscus": { append: script => scripts.push(script) },
        "iframe.giscus-frame": {
          contentWindow: { postMessage: (...args) => messages.push(args) },
        },
      }[selector];
    }
  }
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
  runInNewContext(outputText, {
    HTMLElement: Element,
    AbortController,
    MutationObserver: Observer,
    customElements: {
      get: name => registry.get(name),
      define: (name, value) => registry.set(name, value),
    },
    document: {
      documentElement: root,
      createElement() {
        const script = new EventTarget();
        script.attributes = new Map();
        script.setAttribute = (name, value) =>
          script.attributes.set(name, value);
        script.remove = () => {
          script.removed = true;
        };
        return script;
      },
    },
  });
  const Widget = registry.get("post-comments");
  const widget = new Widget();
  widget.connectedCallback();
  return { widget, button, status, scripts, messages, root, observers };
}

test("comments make no request until clicked and avoid duplicate loads", () => {
  const f = fixture();
  assert.equal(f.scripts.length, 0);
  f.button.dispatchEvent(new Event("click"));
  f.button.dispatchEvent(new Event("click"));
  assert.equal(f.scripts.length, 1);
  const script = f.scripts[0];
  assert.equal(script.src, "https://giscus.app/client.js");
  assert.equal(script.attributes.get("data-mapping"), "pathname");
  assert.equal(script.attributes.get("data-strict"), "1");
  script.dispatchEvent(new Event("load"));
  assert.equal(f.button.hidden, true);
});

test("failed downloads expose retry rather than claiming comments loaded", () => {
  const f = fixture();
  f.button.dispatchEvent(new Event("click"));
  f.scripts[0].dispatchEvent(new Event("error"));
  assert.equal(f.button.disabled, false);
  assert.equal(f.scripts[0].removed, true);
  assert.match(f.status.textContent, /could not load/);
  f.button.dispatchEvent(new Event("click"));
  assert.equal(f.scripts.length, 2);
});

test("theme messages target giscus and observers/listeners are removed on navigation", () => {
  const f = fixture();
  f.root.dataset.theme = "dark";
  f.observers[0].callback();
  assert.equal(f.messages[0][0].giscus.setConfig.theme, "dark_dimmed");
  assert.equal(f.messages[0][1], "https://giscus.app");
  f.widget.disconnectedCallback();
  assert.equal(f.observers[0].disconnected, true);
  f.button.dispatchEvent(new Event("click"));
  assert.equal(f.scripts.length, 0);
  f.widget.connectedCallback();
  f.button.dispatchEvent(new Event("click"));
  assert.equal(f.scripts.length, 1);
});

test("verified defaults enable comments; empty overrides disable them and incomplete overrides fail", async () => {
  const { resolveCommentsConfig } = await import("../src/data/comments.ts");
  const defaults = resolveCommentsConfig(undefined, undefined);
  assert.equal(defaults.repositoryId, "R_kgDOVpgBGg");
  assert.equal(defaults.categoryId, "DIC_kwDOVpgBGs4DK6Ei");
  assert.equal(defaults.category, "Announcements");
  assert.equal(resolveCommentsConfig("", ""), null);
  assert.throws(() => resolveCommentsConfig("Comments", undefined), /Set both/);
  assert.throws(
    () => resolveCommentsConfig(undefined, "DIC_example"),
    /Set both/
  );
  assert.throws(() => resolveCommentsConfig("Comments", "invalid"), /valid/);
  assert.equal(
    resolveCommentsConfig("Comments", "DIC_example").category,
    "Comments"
  );
});
