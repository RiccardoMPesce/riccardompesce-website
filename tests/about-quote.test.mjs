import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { test } from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/components/AboutQuote.astro", import.meta.url), "utf8").match(/<script>([\s\S]*?)<\/script>/)[1];
const {outputText} = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
for (const [random, expected] of [[0,0],[0.5,1],[0.999,2]]) {
  test(`a page visit selects only quotation ${expected + 1}`, () => {
    const quotes = [{hidden:false},{hidden:true},{hidden:true}];
    let definition;
    runInNewContext(outputText, {
      HTMLElement: class { querySelectorAll() { return quotes; } },
      customElements: { get() {}, define(_name, value) { definition=value; } },
      Math: { random: () => random, floor: Math.floor },
    });
    new definition().connectedCallback();
    assert.equal(quotes.filter(quote => !quote.hidden).length, 1);
    assert.equal(quotes[expected].hidden, false);
  });
}
