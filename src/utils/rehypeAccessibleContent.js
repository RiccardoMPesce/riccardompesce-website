/**
 * @description Adds same-tab external-link cues, lazy media and keyboard-scrollable math to Markdown/MDX.
 * @param {{ readonly site: string }} options Canonical site URL for origin comparison.
 * @returns {(tree: object) => void} Rehype transformer; leaves internal and non-HTTP navigation intact.
 * @throws {TypeError} If the canonical site URL is invalid.
 */
export function rehypeAccessibleContent({ site }) {
  const origin = new URL(site).origin;
  const visit = node => {
    if (node.type === "element") {
      node.properties ??= {};
      const props = node.properties;
      if (
        node.tagName === "a" &&
        typeof props.href === "string" &&
        /^(https?:)?\/\//i.test(props.href)
      ) {
        const destination = new URL(props.href, site);
        if (destination.origin !== origin) {
          const existing = Array.isArray(props.rel)
            ? props.rel
            : String(props.rel ?? "").split(/\s+/);
          props.rel = [
            ...new Set([...existing.filter(Boolean), "noopener", "noreferrer"]),
          ];
          if (!props.dataExternalLink) {
            props.dataExternalLink = "true";
            node.children.push(
              {
                type: "element",
                tagName: "span",
                properties: {
                  ariaHidden: "true",
                  dataPagefindIgnore: true,
                  className: ["external-link-icon"],
                },
                children: [{ type: "text", value: " ↗" }],
              },
              {
                type: "element",
                tagName: "span",
                properties: {
                  className: ["sr-only"],
                  dataPagefindIgnore: true,
                },
                children: [
                  {
                    type: "text",
                    value:
                      props.target === "_blank"
                        ? " (external site, opens in a new tab)"
                        : " (external site)",
                  },
                ],
              }
            );
          }
        }
      }
      if (node.tagName === "pre") {
        const code = node.children?.find(child => child.tagName === "code");
        if (code) {
          code.properties ??= {};
          const classes = code.properties.className ?? [];
          const list = Array.isArray(classes)
            ? classes
            : String(classes).split(/\s+/);
          if (!list.some(value => value.startsWith("language-"))) {
            code.properties.className = [
              ...list,
              `language-${props.dataLanguage ?? "text"}`,
            ];
          }
        }
      }
      if (node.tagName === "img") {
        props.loading ??= "lazy";
        props.decoding ??= "async";
        if (props.alt === "") props.ariaHidden = "true";
      }
      const classes = Array.isArray(props.className)
        ? props.className
        : String(props.className ?? "").split(/\s+/);
      if (classes.includes("katex-display")) {
        props.tabIndex = 0;
        props.role = "region";
        props.ariaLabel = "Mathematical expression";
      }
    }
    for (const child of node.children ?? []) visit(child);
  };
  return visit;
}
