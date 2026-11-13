import { readFile, writeFile } from "node:fs/promises";
import { loadPortfolio, resumeDigest } from "./resume-source.mjs";

const output = process.argv[2];
if (!output) throw new Error("Usage: node scripts/export-resume.mjs <output.json>");
const en = await loadPortfolio();
const it = JSON.parse(await readFile(new URL("../src/data/resume-it.json", import.meta.url), "utf8"));

// Translation must preserve the complete source structure, including all evidence links.
function validate(reference, translation, path = "portfolio") {
  if (Array.isArray(reference)) {
    if (!Array.isArray(translation) || translation.length !== reference.length) {
      throw new Error(`Translation length mismatch: ${path}`);
    }
    reference.forEach((value, index) => validate(value, translation[index], `${path}[${index}]`));
  } else if (reference !== null && typeof reference === "object") {
    if (!translation || typeof translation !== "object" || Object.keys(reference).sort().join() !== Object.keys(translation).sort().join()) {
      throw new Error(`Translation structure mismatch: ${path}`);
    }
    for (const key of Object.keys(reference)) validate(reference[key], translation[key], `${path}.${key}`);
  } else if (typeof translation !== typeof reference || (typeof reference === "string" && !translation.trim()) || (typeof reference !== "string" && reference !== translation) || (typeof reference === "string" && reference.startsWith("https://") && reference !== translation)) {
    throw new Error(`Invalid translated value: ${path}`);
  }
}
validate(en, it);
await writeFile(output, JSON.stringify({ en, it, digest: await resumeDigest() }, null, 2));
