import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import ts from "typescript";

const root = new URL("../", import.meta.url);
const inputs = [
  "src/data/portfolio.ts",
  "src/data/education.ts",
  "src/data/resume-it.json",
  "scripts/resume-source.mjs",
  "scripts/generate-resume.py",
];

/**
 * @description Fingerprint content and document layout to reject stale downloads.
 * @returns {Promise<string>} SHA-256 digest of all resume inputs.
 * @throws {Error} If a required input cannot be read.
 */
export async function resumeDigest() {
  const hash = createHash("sha256");
  for (const path of inputs) {
    hash.update(path);
    hash.update(await readFile(new URL(path, root)));
  }
  return hash.digest("hex");
}

/**
 * @description Load the same public career data used by Astro without bundling site configuration.
 * @returns {Promise<object>} English portfolio content.
 * @throws {Error} If TypeScript data cannot be loaded.
 */
export async function loadPortfolio() {
  const educationSource = await readFile(new URL("src/data/education.ts", root), "utf8");
  const educationCode = ts.transpileModule(educationSource, {
    compilerOptions: { module: ts.ModuleKind.ESNext },
  }).outputText;
  const portfolioSource = await readFile(new URL("src/data/portfolio.ts", root), "utf8");
  const portfolioCode = ts.transpileModule(portfolioSource.replace('import { education } from "./education";', ""), {
    compilerOptions: { module: ts.ModuleKind.ESNext },
  }).outputText;
  const source = `${educationCode}\n${portfolioCode}`;
  const module = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
  return module.portfolio;
}
