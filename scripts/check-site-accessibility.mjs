import { readFile, readdir } from "node:fs/promises";
import { auditPage } from "./site-accessibility.mjs";

const root = new URL("../dist/", import.meta.url);
const files = await readdir(root, { recursive: true });
const failures = [];
const pages = files.filter(name => name.endsWith(".html"));
if (pages.length === 0)
  throw new Error("No generated HTML pages found to audit.");
for (const file of pages) {
  const errors = auditPage(await readFile(new URL(file, root), "utf8"));
  failures.push(...errors.map(error => `${file}: ${error}`));
}
if (failures.length)
  throw new Error(
    `Generated accessibility checks failed:\n${failures.join("\n")}`
  );
