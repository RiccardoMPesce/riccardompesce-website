import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { test } from "node:test";
import { checkResumeAssets } from "../scripts/resume-integrity.mjs";
import { resumeDigest } from "../scripts/resume-source.mjs";

async function fixture(t) {
  const path = await mkdtemp(join(tmpdir(), "portfolio-integrity-"));
  t.after(() => rm(path, { recursive: true, force: true }));
  const root = pathToFileURL(path + "/");
  for (const lang of ["en", "it"]) {
    for (const format of ["pdf", "docx"]) {
      await writeFile(
        new URL(`riccardo-pesce-full-portfolio-${lang}.${format}`, root),
        (format === "pdf" ? "%PDF-" : "PK") + "x".repeat(1200)
      );
    }
  }
  await checkResumeAssets(root, "reviewed-source", true);
  return root;
}

test("committed downloads match the current generator and reviewed source", async () => {
  await checkResumeAssets(
    new URL("../public/portfolio-downloads/", import.meta.url),
    await resumeDigest()
  );
});

test("stale sources fail without modifying the reviewed manifest", async t => {
  const root = await fixture(t);
  const before = await readFile(new URL("manifest.json", root), "utf8");
  await assert.rejects(
    checkResumeAssets(root, "changed-layout"),
    /source\/layout changed.*resume:accept/
  );
  assert.equal(await readFile(new URL("manifest.json", root), "utf8"), before);
});

test("modified assets name the exact failing document", async t => {
  const root = await fixture(t);
  await writeFile(
    new URL("riccardo-pesce-full-portfolio-it.pdf", root),
    "%PDF-" + "z".repeat(1200)
  );
  await assert.rejects(
    checkResumeAssets(root, "reviewed-source"),
    /modified since review: riccardo-pesce-full-portfolio-it.pdf/
  );
});

test("missing and invalid binary files fail before accepting a manifest", async t => {
  const root = await fixture(t);
  const file = new URL("riccardo-pesce-full-portfolio-en.docx", root);
  await rm(file);
  await assert.rejects(
    checkResumeAssets(root, "reviewed-source", true),
    /Missing or unreadable.*en.docx/
  );
  await writeFile(file, "invalid");
  await assert.rejects(
    checkResumeAssets(root, "reviewed-source", true),
    /Invalid portfolio asset.*en.docx/
  );
});

test("manifest property order does not affect integrity", async t => {
  const root = await fixture(t);
  const path = new URL("manifest.json", root);
  const manifest = JSON.parse(await readFile(path, "utf8"));
  await writeFile(
    path,
    JSON.stringify({
      files: Object.fromEntries(Object.entries(manifest.files).reverse()),
      sourceDigest: manifest.sourceDigest,
    })
  );
  await checkResumeAssets(root, "reviewed-source");
});

test("fingerprints ignore JSON property order and generator line endings but detect content and font changes", async () => {
  const { resumeFingerprint } =
    await import("../scripts/resume-fingerprint.mjs");
  const content = {
    en: { title: "Engineer", roles: ["A", "B"] },
    it: { title: "Ingegnere" },
  };
  const reordered = {
    it: { title: "Ingegnere" },
    en: { roles: ["A", "B"], title: "Engineer" },
  };
  const baseline = resumeFingerprint(content, 'font = "Calibri"\n');
  assert.equal(baseline, resumeFingerprint(reordered, 'font = "Calibri"\r\n'));
  assert.notEqual(
    baseline,
    resumeFingerprint(
      { ...content, en: { title: "Lead", roles: ["A", "B"] } },
      'font = "Calibri"\n'
    )
  );
  assert.notEqual(baseline, resumeFingerprint(content, 'font = "Arial"\n'));
  assert.throws(
    () => resumeFingerprint({ invalid: undefined }, "layout"),
    /finite JSON/
  );
});
