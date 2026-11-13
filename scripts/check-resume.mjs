import { resumeDigest } from "./resume-source.mjs";
import { checkResumeAssets } from "./resume-integrity.mjs";

await checkResumeAssets(
  new URL("../public/portfolio-downloads/", import.meta.url),
  await resumeDigest(),
  process.argv.includes("--write")
);
