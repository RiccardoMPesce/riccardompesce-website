import assert from "node:assert/strict";
import { test } from "node:test";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { rehypeAccessibleContent } from "../src/utils/rehypeAccessibleContent.js";
import { rehypeTableWrapper } from "../src/utils/rehypeTableWrapper.js";
import { auditPage } from "../scripts/site-accessibility.mjs";

const element = (tagName, properties = {}, children = []) => ({
  type: "element",
  tagName,
  properties,
  children,
});
const link = href =>
  element("a", { href }, [{ type: "text", value: "Evidence" }]);

test("external links keep same-tab navigation, existing rel and an announced destination cue", () => {
  const external = link("https://example.org/paper");
  external.properties.rel = ["author"];
  const internal = link("https://riccardompesce.com/about");
  const local = link("/posts/");
  const mail = link("mailto:example@example.org");
  const tree = { children: [external, internal, local, mail] };
  const transform = rehypeAccessibleContent({
    site: "https://riccardompesce.com",
  });
  transform(tree);
  transform(tree);
  assert.deepEqual(external.properties.rel, [
    "author",
    "noopener",
    "noreferrer",
  ]);
  assert.equal(external.properties.target, undefined);
  assert.equal(external.children.length, 3);
  assert.match(external.children[2].children[0].value, /external site/);
  assert.equal(internal.children.length, 1);
  assert.equal(local.children.length, 1);
  assert.equal(mail.children.length, 1);
});

test("explicit new-tab links announce that behavior; decorative media stays unannounced", () => {
  const external = link("//example.org");
  external.properties.target = "_blank";
  const image = element("img", { alt: "" });
  rehypeAccessibleContent({ site: "https://riccardompesce.com" })({
    children: [external, image],
  });
  assert.match(external.children[2].children[0].value, /new tab/);
  assert.deepEqual(image.properties, {
    alt: "",
    loading: "lazy",
    decoding: "async",
    ariaHidden: "true",
  });
});

test("Markdown math retains MathML and exposes horizontally scrollable blocks to keyboard users", async () => {
  const processor = await createMarkdownProcessor({
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      [rehypeKatex, { output: "htmlAndMathml", trust: false, strict: "error" }],
      rehypeTableWrapper,
      [rehypeAccessibleContent, { site: "https://riccardompesce.com" }],
    ],
  });
  const result = await processor.render(
    "# Accessible math\n\n$$\n\\frac{a}{b} = c\n$$\n\n| Head | Value |\n| --- | --- |\n| A | B |\n"
  );
  assert.match(result.code, /<math[^>]+xmlns/);
  assert.match(result.code, /aria-hidden="true"/);
  assert.match(
    result.code,
    /tabindex="0" role="region" aria-label="Mathematical expression"/
  );
  assert.match(result.code, /aria-label="Scrollable table"/);
});

const page = body =>
  `<!doctype html><html lang="en"><body><a id="skip-to-content" href="#main-content">Skip to main content</a><header><nav aria-label="Main navigation"><a href="/">Home</a></nav></header><main id="main-content" tabindex="-1"><h1>Page</h1>${body}</main><footer>Footer</footer></body></html>`;

test("HTML audit accepts landmarks and dimensioned media; rejects accessibility regressions", () => {
  assert.deepEqual(
    auditPage(
      page(
        '<img src="/photo.webp" alt="Portrait" width="160" height="160" loading="eager" decoding="async">'
      )
    ),
    []
  );
  assert.ok(
    auditPage(
      page(
        '<img src="/photo.webp"><button></button><input id="email"><nav></nav>'
      )
    ).length >= 5
  );
  assert.ok(
    auditPage(
      page(
        '<button aria-controls="missing">Menu</button><span id="same"></span><span id="same"></span>'
      )
    ).some(issue => issue.includes("missing"))
  );
  assert.ok(
    auditPage(
      page('<a href="https://example.org" target="_blank">Example</a>')
    ).some(issue => issue.includes("noopener"))
  );
  assert.ok(
    auditPage(page("").replace('id="skip-to-content"', 'id="other"')).some(
      issue => issue.includes("first focusable")
    )
  );
});
