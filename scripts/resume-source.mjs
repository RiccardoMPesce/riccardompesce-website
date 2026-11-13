import { readFile } from "node:fs/promises";
import { resumeFingerprint } from "./resume-fingerprint.mjs";
import ts from "typescript";

const root = new URL("../", import.meta.url);
/**
 * @description Fingerprint exported content and document layout while ignoring source formatting.
 * @returns {Promise<string>} SHA-256 digest of all resume inputs.
 * @throws {Error} If a required input cannot be read.
 */
export async function resumeDigest() {
  const [en, translation, generator] = await Promise.all([
    loadPortfolio(),
    readFile(new URL("src/data/resume-it.json", root), "utf8"),
    readFile(new URL("scripts/generate-resume.py", root), "utf8"),
  ]);
  return resumeFingerprint({ en, it: JSON.parse(translation) }, generator);
}

/**
 * @description Load the same public career data used by Astro without bundling site configuration.
 * @returns {Promise<object>} English portfolio content.
 * @throws {Error} If TypeScript data cannot be loaded.
 */
export async function loadPortfolio() {
  const educationSource = await readFile(
    new URL("src/data/education.ts", root),
    "utf8"
  );
  const educationCode = ts.transpileModule(educationSource, {
    compilerOptions: { module: ts.ModuleKind.ESNext },
  }).outputText;
  const portfolioSource = await readFile(
    new URL("src/data/portfolio.ts", root),
    "utf8"
  );
  const portfolioCode = ts.transpileModule(portfolioSource, {
    compilerOptions: { module: ts.ModuleKind.ESNext },
    transformers: {
      before: [
        context => sourceFile =>
          context.factory.updateSourceFile(
            sourceFile,
            sourceFile.statements.filter(
              statement =>
                !(
                  ts.isImportDeclaration(statement) &&
                  ts.isStringLiteral(statement.moduleSpecifier) &&
                  statement.moduleSpecifier.text === "./education"
                )
            )
          ),
      ],
    },
  }).outputText;
  const source = `${educationCode}\n${portfolioCode}`;
  const module = await import(
    `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
  );
  return module.portfolio;
}
