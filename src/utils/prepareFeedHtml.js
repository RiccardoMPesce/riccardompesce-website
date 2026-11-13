import { parseFragment, serialize } from "parse5";

/**
 * @description Resolves rendered feed links and media against the article URL and removes executable or decorative UI.
 * @param {string} html Rendered article fragment, including MDX output.
 * @param {string} articleUrl Absolute canonical article URL.
 * @returns {string} Semantic HTML suitable for an RSS content:encoded payload.
 * @throws {TypeError} If the article URL is invalid.
 */
export function prepareFeedHtml(html, articleUrl) {
  const base = new URL(articleUrl);
  const tree = parseFragment(html);
  const visit = node => {
    if (!node.childNodes) return;
    node.childNodes = node.childNodes.filter(
      child =>
        !["script", "style", "button"].includes(child.tagName) &&
        !child.attrs?.some(attr => attr.name === "data-pagefind-ignore")
    );
    for (const child of node.childNodes) {
      for (const attr of child.attrs ?? []) {
        if (["href", "src", "poster"].includes(attr.name)) {
          const url = new URL(attr.value, base);
          attr.value = ["http:", "https:", "mailto:", "tel:"].includes(
            url.protocol
          )
            ? url.href
            : "";
        }
        if (attr.name === "srcset") {
          attr.value = attr.value
            .split(",")
            .map(candidate => {
              const [source, ...descriptor] = candidate.trim().split(/\s+/);
              const url = new URL(source, base);
              if (!["http:", "https:"].includes(url.protocol))
                throw new TypeError("Unsupported feed image URL");
              return [url.href, ...descriptor].join(" ");
            })
            .join(", ");
        }
      }
      visit(child);
    }
  };
  visit(tree);
  return serialize(tree);
}
