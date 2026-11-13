import assert from "node:assert/strict";
import { parseFragment } from "parse5";
import { test } from "node:test";
import { prepareFeedHtml } from "../src/utils/prepareFeedHtml.js";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { rehypeAccessibleContent } from "../src/utils/rehypeAccessibleContent.js";

test("feed keeps semantic text, math and code, resolving links and image candidates", () => {
  const html = prepareFeedHtml('<h2>Reading</h2><p><a href="../other/">Next</a><a href="#part">Section</a></p><img src="/image.png" srcset="/small.png 400w, /large.png 800w"><math><mi>x</mi></math><pre><code class="language-ts">const x = 1;</code></pre>', "https://example.com/posts/current/");
  assert.match(html, /href="https:\/\/example.com\/posts\/other\/"/);
  assert.match(html, /href="https:\/\/example.com\/posts\/current\/#part"/);
  assert.match(html, /src="https:\/\/example.com\/image.png"/);
  assert.match(html, /https:\/\/example.com\/small.png 400w, https:\/\/example.com\/large.png 800w/);
  assert.match(html, /<math><mi>x<\/mi><\/math>/);
  assert.match(html, /<pre><code class="language-ts">const x = 1;/);
});

test("feed excludes executable and decorative UI and refuses invalid base URLs", () => {
  const html = prepareFeedHtml('<script>alert(1)</script><style>p{}</style><button>Copy</button><aside data-pagefind-ignore>Share</aside><p>Article</p><a href="javascript:alert(1)">Unsafe</a>', "https://example.com/");
  assert.equal(html, '<p>Article</p><a href="">Unsafe</a>');
  assert.throws(() => prepareFeedHtml("<p>Text</p>", "invalid"), TypeError);
});

test("fenced blocks declare a language without changing extractable code text", async () => {
  const renderer = await createMarkdownProcessor({ rehypePlugins: [[rehypeAccessibleContent, { site: "https://example.com" }]] });
  const { code } = await renderer.render('```ts\nconst answer = 42;\n```\n\n```\nplain text\n```');
  assert.match(code, /<code class="language-ts">/);
  assert.match(code, /<code class="language-plaintext">/);
  const text = node => node.nodeName === "#text" ? node.value : (node.childNodes ?? []).map(text).join("");
  assert.equal(text(parseFragment(code)), "const answer = 42;\nplain text");
});
