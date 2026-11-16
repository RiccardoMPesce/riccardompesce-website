import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";
import { loadPortfolio } from "../scripts/resume-source.mjs";

const source = await readFile(new URL("../src/data/course-syllabi.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { courseSyllabi } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const portfolio = await loadPortfolio();
const courses = portfolio.education.flatMap(degree => degree.coursework);
const referenced = courses.filter(course => course.syllabus);

test("every referenced transcript course has exactly one guide for its confirmed edition", () => {
  assert.equal(referenced.length, 32);
  const codes = referenced.map(course => {
    const url = new URL(course.syllabus.url);
    assert.equal(url.protocol, "https:");
    assert.ok(url.hostname.endsWith(".unict.it"));
    const code = url.searchParams.get("cod");
    const record = courseSyllabi[code];
    assert.ok(record, `Missing ${course.name}`);
    assert.equal(record.academicYear, course.syllabus.academicYear, course.name);
    assert.ok(record.topics.length > 0, course.name);
    assert.equal(new Set(record.topics).size, record.topics.length, course.name);
    for (const topic of record.topics) assert.ok(typeof topic === "string" && topic.trim().length > 0);
    return code;
  });
  assert.deepEqual(Object.keys(courseSyllabi).sort(), codes.sort());
  assert.equal(courses.filter(course => !course.syllabus).length, 4, "Recognized activities must not gain invented university programmes");
});

test("incomplete historical records remain explicitly distinguished from published programmes", () => {
  const incomplete = Object.entries(courseSyllabi).filter(([, record]) => record.coverage === "objectives-only").map(([code]) => code).sort();
  assert.deepEqual(incomplete, ["1678", "2913", "2928"]);
  assert.equal(Object.values(courseSyllabi).filter(record => record.coverage === "programme").length, 29);
});
