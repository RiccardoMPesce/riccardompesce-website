import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { setImmediate } from "node:timers/promises";
import ts from "typescript";

function compile(path, module = ts.ModuleKind.ESNext) {
  return ts.transpileModule(
    readFileSync(new URL(path, import.meta.url), "utf8"),
    {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module },
    }
  ).outputText;
}

const exports = {};
runInNewContext(
  compile("../src/utils/getShareUrl.ts", ts.ModuleKind.CommonJS),
  {
    exports,
    URL,
  }
);
const { getShareUrl } = exports;
const script = compile("../src/scripts/share-links.ts");

test("sharing encodes reserved characters as a single URL parameter", () => {
  const page = "https://example.com/posts/caf%C3%A9/?a=1&b=two#section";
  for (const [base, parameter] of [
    ["https://www.linkedin.com/sharing/share-offsite/?url=", "url"],
    ["https://twitter.com/intent/tweet?url=", "url"],
    ["https://www.facebook.com/sharer/sharer.php?u=", "u"],
    ["https://wa.me/?text=", "text"],
    ["https://t.me/share/url?url=", "url"],
    ["mailto:?body=", "body"],
  ]) {
    const result = new URL(getShareUrl(base, page));
    assert.equal(result.searchParams.get(parameter), page);
    assert.equal(result.searchParams.size, 1);
    assert.equal(result.hash, "");
  }
});

test("invalid and unsafe sharing URLs fail explicitly", () => {
  for (const base of [
    "invalid",
    "javascript:alert(1)",
    "https://example.com/?url=oops",
    "http://example.com/?url=",
  ]) {
    assert.throws(() => getShareUrl(base, "https://example.com/"), {
      name: "TypeError",
    });
  }
  for (const page of [
    "/relative",
    "javascript:alert(1)",
    "mailto:test@example.com",
  ]) {
    assert.throws(() => getShareUrl("https://wa.me/?text=", page), {
      name: "TypeError",
    });
  }
});

function fixture({ secure = true, clipboard, share } = {}) {
  class Control extends EventTarget {
    hidden = true;
    disabled = false;
    value = "https://riccardompesce.com/posts/welcome/";
    textContent = "Manual copy";
    dataset = {
      copied: "Copied",
      copyError: "Copy denied",
      shareError: "Share failed",
    };
    select() {
      this.selected = true;
    }
    focus() {
      this.focused = true;
    }
  }
  const input = new Control();
  const status = new Control();
  const copy = new Control();
  const native = new Control();
  const modalCopy = new Control();
  const modalStatus = new Control();
  const opener = new Control();
  const close = new Control();
  class Dialog extends EventTarget {
    open = false;
    opens = 0;
    showModal() {
      this.open = true;
      this.opens += 1;
    }
    close() {
      if (!this.open) return;
      this.open = false;
      this.dispatchEvent(new Event("close"));
    }
    getBoundingClientRect() {
      return { left: 100, right: 400, top: 100, bottom: 400 };
    }
    escape() {
      const event = new Event("cancel", { cancelable: true });
      this.dispatchEvent(event);
      if (!event.defaultPrevented) this.close();
    }
  }
  const dialog = new Dialog();
  const registry = new Map();
  class Element {
    dataset = { shareTitle: "Article title" };
    querySelectorAll(selector) {
      return selector === "[data-copy-link]" ? [copy, modalCopy] : [];
    }
    querySelector(selector) {
      return {
        input,
        '[role="status"]': status,
        "[data-copy-link]": copy,
        "[data-native-share]": native,
        dialog,
        "[data-open-share]": opener,
        "[data-close-share]": close,
        "[data-modal-status]": modalStatus,
      }[selector];
    }
  }
  runInNewContext(script, {
    HTMLElement: Element,
    AbortController,
    DOMException,
    window: { isSecureContext: secure },
    navigator: { clipboard, share },
    customElements: {
      get: name => registry.get(name),
      define: (name, value) => registry.set(name, value),
    },
  });
  const Widget = registry.get("share-links");
  const widget = new Widget();
  widget.connectedCallback();
  return {
    widget,
    input,
    status,
    copy,
    native,
    dialog,
    opener,
    close,
    modalCopy,
    modalStatus,
  };
}

test("manual copying remains available when APIs or secure context are absent", () => {
  for (const options of [
    {},
    { secure: false, clipboard: { writeText() {} }, share() {} },
  ]) {
    const f = fixture(options);
    assert.equal(f.copy.hidden, true);
    assert.equal(f.native.hidden, true);
    f.input.dispatchEvent(new Event("click"));
    assert.equal(f.input.selected, true);
  }
});

test("copy writes the public URL and announces success only after completion", async () => {
  const writes = [];
  const f = fixture({
    clipboard: {
      async writeText(value) {
        writes.push(value);
      },
    },
  });
  assert.equal(f.copy.hidden, false);
  f.copy.dispatchEvent(new Event("click"));
  assert.equal(f.copy.disabled, true);
  assert.equal(f.status.textContent, "");
  await setImmediate();
  assert.deepEqual(writes, [f.input.value]);
  assert.equal(f.status.textContent, "Copied");
  assert.equal(f.copy.disabled, false);
});

test("clipboard rejection selects the URL and reports the manual fallback", async () => {
  const f = fixture({
    clipboard: {
      async writeText() {
        throw new DOMException("Denied", "NotAllowedError");
      },
    },
  });
  f.copy.dispatchEvent(new Event("click"));
  await setImmediate();
  assert.equal(f.modalStatus.textContent, "Copy denied");
  assert.equal(f.dialog.open, true);
  assert.equal(f.input.selected, true);
  assert.equal(f.input.focused, true);
  assert.equal(f.copy.disabled, false);
});

test("native sharing supplies the title and URL, and cancellation is not an error", async () => {
  const shares = [];
  const f = fixture({
    async share(data) {
      shares.push(data);
      throw new DOMException("Cancelled", "AbortError");
    },
  });
  assert.equal(f.native.hidden, false);
  f.native.dispatchEvent(new Event("click"));
  await setImmediate();
  assert.equal(shares[0].url, f.input.value);
  assert.equal(shares[0].title, "Article title");
  assert.equal(f.status.textContent, "");
  assert.equal(f.native.disabled, false);
});

test("other native sharing errors offer an explicit fallback", async () => {
  const f = fixture({
    async share() {
      throw new Error("Unavailable");
    },
  });
  f.native.dispatchEvent(new Event("click"));
  await setImmediate();
  assert.equal(f.status.textContent, "Share failed");
});

test("reconnection avoids duplicate handlers and disconnection removes them", async () => {
  let writes = 0;
  const f = fixture({
    clipboard: {
      async writeText() {
        writes += 1;
      },
    },
  });
  f.widget.connectedCallback();
  f.copy.dispatchEvent(new Event("click"));
  await setImmediate();
  assert.equal(writes, 1);
  f.widget.disconnectedCallback();
  f.copy.dispatchEvent(new Event("click"));
  await setImmediate();
  assert.equal(writes, 1);
});

test("More opens its own modal once, and closing restores focus to the trigger", () => {
  const f = fixture();
  const other = fixture();
  assert.equal(f.opener.hidden, false);
  f.opener.dispatchEvent(new Event("click"));
  f.opener.dispatchEvent(new Event("click"));
  assert.equal(f.dialog.open, true);
  assert.equal(f.dialog.opens, 1);
  assert.equal(other.dialog.open, false);
  assert.equal(f.close.focused, true);
  f.close.dispatchEvent(new Event("click"));
  assert.equal(f.dialog.open, false);
  assert.equal(f.opener.focused, true);
});

test("Escape is left to native dialog handling and restores focus", () => {
  const f = fixture();
  f.opener.dispatchEvent(new Event("click"));
  f.dialog.escape();
  assert.equal(f.dialog.open, false);
  assert.equal(f.opener.focused, true);
});

function pointer(target, type, x, y) {
  const event = new Event(type);
  Object.assign(event, { clientX: x, clientY: y });
  target.dispatchEvent(event);
}

test("only a gesture starting and ending outside dismisses the modal", () => {
  const f = fixture();
  f.opener.dispatchEvent(new Event("click"));
  pointer(f.dialog, "pointerdown", 150, 150);
  pointer(f.dialog, "click", 150, 150);
  assert.equal(f.dialog.open, true);
  pointer(f.dialog, "pointerdown", 150, 150);
  pointer(f.dialog, "click", 10, 10);
  assert.equal(f.dialog.open, true);
  pointer(f.dialog, "pointerdown", 10, 10);
  pointer(f.dialog, "click", 10, 10);
  assert.equal(f.dialog.open, false);
});

test("modal copying announces success inside the active dialog", async () => {
  const writes = [];
  const f = fixture({
    clipboard: {
      async writeText(value) {
        writes.push(value);
      },
    },
  });
  f.opener.dispatchEvent(new Event("click"));
  f.modalCopy.dispatchEvent(new Event("click"));
  await setImmediate();
  assert.deepEqual(writes, [f.input.value]);
  assert.equal(f.modalStatus.textContent, "Copied");
  assert.equal(f.status.textContent, "");
});

test("navigation closes the dialog and removes modal listeners", () => {
  const f = fixture();
  f.opener.dispatchEvent(new Event("click"));
  f.widget.disconnectedCallback();
  assert.equal(f.dialog.open, false);
  f.opener.dispatchEvent(new Event("click"));
  assert.equal(f.dialog.open, false);
});
