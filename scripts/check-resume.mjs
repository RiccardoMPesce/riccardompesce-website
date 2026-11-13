import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resumeDigest } from "./resume-source.mjs";

const root = new URL("../public/portfolio-downloads/", import.meta.url);
const digest = await resumeDigest();
const files = {};
for (const language of ["en", "it"]) {
  for (const format of ["pdf", "docx"]) {
    const name = `riccardo-pesce-full-portfolio-${language}.${format}`;
    const bytes = await readFile(new URL(name, root));
    const signature = format === "pdf" ? "%PDF-" : "PK";
    if (bytes.length < 1000 || !bytes.subarray(0, signature.length).equals(Buffer.from(signature))) {
      throw new Error(`Invalid portfolio asset: ${name}`);
    }
    files[name] = createHash("sha256").update(bytes).digest("hex");
  }
}
const manifest = { sourceDigest: digest, files };
const target = new URL("manifest.json", root);
if (process.argv.includes("--write")) {
  await writeFile(target, JSON.stringify(manifest, null, 2) + "\n");
} else {
  const saved = JSON.parse(await readFile(target, "utf8"));
  if (JSON.stringify(manifest) !== JSON.stringify(saved)) {
    throw new Error("Portfolio assets are stale or modified. Regenerate both languages and formats, review the rendered documents, then run node scripts/check-resume.mjs --write. See README.md.");
  }
}
