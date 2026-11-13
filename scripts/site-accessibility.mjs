import { parse } from "parse5";

/**
 * @description Checks structural accessibility invariants in generated HTML; does not replace browser or assistive-technology testing.
 * @param {string} html Generated page markup.
 * @returns {readonly string[]} Actionable violations, empty when the page meets these invariants.
 */
export function auditPage(html) {
  const tree = parse(html);
  const elements = [];
  function walk(node) {
    if (node.tagName) elements.push(node);
    for (const child of node.childNodes ?? []) walk(child);
  }
  walk(tree);
  const attr = (node, name) =>
    node.attrs?.find(attribute => attribute.name === name)?.value;
  const has = (node, name) => attr(node, name) !== undefined;
  const tag = name => elements.filter(node => node.tagName === name);
  const ids = new Map();
  const errors = [];
  for (const node of elements) {
    const id = attr(node, "id");
    if (!id) continue;
    if (ids.has(id)) errors.push(`Duplicate id: ${id}`);
    ids.set(id, node);
  }
  const mains = tag("main");
  if (
    mains.length !== 1 ||
    attr(mains[0], "id") !== "main-content" ||
    attr(mains[0], "tabindex") !== "-1"
  )
    errors.push("Exactly one focusable main#main-content is required.");
  const isSiteLandmark = node => {
    let parent = node.parentNode;
    while (parent) {
      if (
        ["article", "aside", "main", "nav", "section"].includes(parent.tagName)
      )
        return false;
      parent = parent.parentNode;
    }
    return true;
  };
  if (
    tag("header").filter(isSiteLandmark).length !== 1 ||
    tag("footer").filter(isSiteLandmark).length !== 1
  ) {
    errors.push("Exactly one site header and footer are required.");
  }
  if (tag("h1").length !== 1)
    errors.push("Exactly one page-level h1 is required.");
  const isInteractive = node =>
    (node.tagName === "a" && has(node, "href")) ||
    ["button", "select", "textarea", "summary"].includes(node.tagName) ||
    (node.tagName === "input" && attr(node, "type") !== "hidden") ||
    (Number(attr(node, "tabindex")) >= 0 && has(node, "tabindex"));
  const first = elements.find(isInteractive);
  if (
    !first ||
    attr(first, "id") !== "skip-to-content" ||
    attr(first, "href") !== "#main-content"
  )
    errors.push("Skip to main content must be the first focusable element.");
  const text = node =>
    attr(node, "aria-hidden") === "true"
      ? ""
      : (node.value ?? "") + (node.childNodes ?? []).map(text).join("");
  function name(node) {
    const labelledBy = attr(node, "aria-labelledby");
    if (labelledBy)
      return labelledBy
        .split(/\s+/)
        .map(id => (ids.has(id) ? text(ids.get(id)) : ""))
        .join(" ")
        .trim();
    return (
      attr(node, "aria-label") ??
      attr(node, "alt") ??
      text(node) ??
      ""
    ).trim();
  }
  for (const node of elements) {
    if (
      node.tagName === "nav" &&
      !attr(node, "aria-label") &&
      !attr(node, "aria-labelledby")
    )
      errors.push("Navigation landmark needs an accessible label.");
    if (["a", "button", "summary"].includes(node.tagName) && !name(node))
      errors.push(`Unnamed ${node.tagName}.`);
    for (const key of [
      "aria-controls",
      "aria-labelledby",
      "aria-describedby",
    ]) {
      for (const id of (attr(node, key) ?? "").split(/\s+/).filter(Boolean)) {
        if (!ids.has(id)) errors.push(`${key} points to missing #${id}.`);
      }
    }
    if (node.tagName === "img") {
      if (!has(node, "alt")) errors.push("Image has no alt attribute.");
      if (attr(node, "alt") === "" && attr(node, "aria-hidden") !== "true")
        errors.push("Decorative image must have aria-hidden=true.");
      if (
        !(
          Number(attr(node, "width")) > 0 && Number(attr(node, "height")) > 0
        ) &&
        !/aspect-ratio\s*:/.test(attr(node, "style") ?? "")
      )
        errors.push(`Image needs intrinsic dimensions: ${attr(node, "src")}.`);
      if (
        attr(node, "decoding") !== "async" ||
        !["lazy", "eager"].includes(attr(node, "loading"))
      )
        errors.push(
          "Image needs an explicit loading policy and async decoding."
        );
    }
    if (
      node.tagName === "svg" &&
      attr(node, "aria-hidden") !== "true" &&
      !name(node) &&
      !node.childNodes?.some(child => child.tagName === "title")
    )
      errors.push("SVG needs a name or aria-hidden=true.");
    if (node.tagName === "a" && attr(node, "target") === "_blank") {
      const rel = (attr(node, "rel") ?? "").split(/\s+/);
      if (!rel.includes("noopener") || !rel.includes("noreferrer"))
        errors.push(
          `New-tab link needs noopener noreferrer: ${attr(node, "href")}.`
        );
    }
    if (
      ["input", "select", "textarea"].includes(node.tagName) &&
      attr(node, "type") !== "hidden"
    ) {
      let ancestor = node.parentNode;
      while (ancestor && ancestor.tagName !== "label")
        ancestor = ancestor.parentNode;
      const labelled = tag("label").some(
        label => attr(label, "for") && attr(label, "for") === attr(node, "id")
      );
      if (
        !ancestor &&
        !labelled &&
        !attr(node, "aria-label") &&
        !attr(node, "aria-labelledby")
      )
        errors.push(
          `Unlabelled ${node.tagName}: ${attr(node, "id") ?? "unknown"}.`
        );
    }
  }
  return errors;
}
