import { createHash } from "node:crypto";

function canonicalJson(value) {
  if (value === null || typeof value === "string" || typeof value === "boolean")
    return JSON.stringify(value);
  if (typeof value === "number" && Number.isFinite(value))
    return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object")
    return `{${Object.keys(value)
      .sort()
      .map(key => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(",")}}`;
  throw new TypeError("Resume data must contain only finite JSON values.");
}

/**
 * @description Fingerprints exported content and the document generator, independent of TypeScript source formatting or object property order.
 * @param {unknown} content Bilingual exported portfolio data.
 * @param {string} generator Document-layout source, including its fonts and fixed introduction.
 * @returns {string} Versioned SHA-256 fingerprint.
 * @throws {TypeError} If content contains unsupported non-JSON values.
 */
export function resumeFingerprint(content, generator) {
  return createHash("sha256")
    .update("portfolio-content-v2\0")
    .update(canonicalJson(content))
    .update("\0generator\0")
    .update(generator.replace(/\r\n/g, "\n"))
    .digest("hex");
}
