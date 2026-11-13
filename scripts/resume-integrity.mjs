import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

/**
 * @description Checks committed bilingual downloads without regenerating or blessing stale files during a build.
 * @param {URL} root Directory containing the four documents and manifest.json.
 * @param {string} sourceDigest Fingerprint of the current content and generator.
 * @param {boolean} [write=false] Record reviewed assets only when explicitly requested.
 * @returns {Promise<void>} Resolves when the files and source match the reviewed manifest.
 * @throws {Error} If a document, manifest, fingerprint or binary hash is invalid.
 */
export async function checkResumeAssets(root, sourceDigest, write = false) {
  const files = {};
  for (const language of ["en", "it"]) {
    for (const format of ["pdf", "docx"]) {
      const name = `riccardo-pesce-full-portfolio-${language}.${format}`;
      const bytes = await readFile(new URL(name, root)).catch(error => {
        throw new Error(`Missing or unreadable portfolio asset: ${name}`, {
          cause: error,
        });
      });
      const signature = format === "pdf" ? "%PDF-" : "PK";
      if (
        bytes.length < 1000 ||
        !bytes.subarray(0, signature.length).equals(Buffer.from(signature))
      ) {
        throw new Error(`Invalid portfolio asset: ${name}`);
      }
      files[name] = createHash("sha256").update(bytes).digest("hex");
    }
  }
  const target = new URL("manifest.json", root);
  if (write) {
    await writeFile(
      target,
      JSON.stringify({ sourceDigest, files }, null, 2) + "\n"
    );
    return;
  }
  const saved = JSON.parse(await readFile(target, "utf8"));
  if (
    !saved ||
    typeof saved !== "object" ||
    !saved.files ||
    typeof saved.files !== "object"
  ) {
    throw new Error(
      "Invalid portfolio manifest: public/portfolio-downloads/manifest.json"
    );
  }
  if (saved.sourceDigest !== sourceDigest) {
    throw new Error(
      "Portfolio source/layout changed since the reviewed downloads were generated. Regenerate and review all four PDF/DOCX files, then run npm run resume:accept and commit the documents and manifest together. See README.md (Portfolio downloads). The build never updates the manifest automatically."
    );
  }
  for (const [name, hash] of Object.entries(files)) {
    if (saved.files[name] !== hash) {
      throw new Error(
        `Portfolio asset modified since review: ${name}. Restore the reviewed file or regenerate and review all four downloads before running npm run resume:accept.`
      );
    }
  }
  if (Object.keys(saved.files).length !== Object.keys(files).length) {
    throw new Error(
      "Portfolio manifest must contain exactly the four bilingual PDF/DOCX assets."
    );
  }
}
