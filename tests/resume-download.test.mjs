import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/scripts/resume-download.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
});
function fixture({ incomplete = false } = {}) {
  const registry = new Map();
  class Element extends EventTarget {
    value = "";
    hidden = true;
    textContent = "";
    querySelector(selector) { return this.elements[selector] ?? null; }
  }
  runInNewContext(outputText, {
    HTMLElement: Element,
    AbortController,
    customElements: { get: name => registry.get(name), define: (name, value) => registry.set(name, value) },
  });
  const element = new (registry.get("resume-download"))();
  element.elements = Object.fromEntries(["language", "format", "link", "controls", "fallback", "status"].map(name => [`[data-resume-${name}]`, new Element()]));
  element.elements["[data-resume-language]"].value = "en";
  element.elements["[data-resume-format]"].value = "pdf";
  if (incomplete) delete element.elements["[data-resume-status]"];
  return element;
}

test("all four choices select their actual download with an accessible label", () => {
  const element = fixture();
  element.connectedCallback();
  const language = element.elements["[data-resume-language]"];
  const format = element.elements["[data-resume-format]"];
  const link = element.elements["[data-resume-link]"];
  for (const lang of ["en", "it"]) {
    for (const extension of ["pdf", "docx"]) {
      language.value = lang;
      format.value = extension;
      format.dispatchEvent(new Event("change"));
      assert.equal(link.href, `/resume/riccardo-pesce-master-resume-${lang}.${extension}`);
      assert.equal(link.download, `riccardo-pesce-master-resume-${lang}.${extension}`);
      assert.match(link.textContent, new RegExp(extension.toUpperCase()));
      assert.match(element.elements["[data-resume-status]"].textContent, /ready to download/);
    }
  }
  assert.equal(element.elements["[data-resume-controls]"].hidden, false);
  assert.equal(element.elements["[data-resume-fallback]"].hidden, true);
});

test("listeners disconnect and reconnect after Astro navigation", () => {
  const element = fixture();
  element.connectedCallback();
  element.disconnectedCallback();
  const language = element.elements["[data-resume-language]"];
  language.value = "it";
  language.dispatchEvent(new Event("change"));
  assert.match(element.elements["[data-resume-link]"].href, /-en.pdf$/);
  element.connectedCallback();
  assert.match(element.elements["[data-resume-link]"].href, /-it.pdf$/);
});

test("incomplete controls fail explicitly while static fallback links stay available", () => {
  const element = fixture({ incomplete: true });
  assert.throws(() => element.connectedCallback(), /incomplete/);
  assert.equal(element.elements["[data-resume-controls]"].hidden, true);
  const component = readFileSync(new URL("../src/components/ResumeDownload.astro", import.meta.url), "utf8");
  assert.match(component, /data-resume-fallback/);
  assert.match(component, /formats.map/);
});
