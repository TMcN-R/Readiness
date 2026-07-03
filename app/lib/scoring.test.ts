import { test } from "node:test";
import assert from "node:assert/strict";
import {
  SECTIONS,
  sectionScore,
  sectionPriority,
  theoreticalReadiness,
  readinessLevel,
  exposureDivisor,
  actualReadiness,
  actualReadinessSummary,
  countryAdjustedReadiness,
  countryStatus,
} from "./scoring";

test("workbook example: 55x Formal, Malawi/Severe, high-risk activity, multi-country", () => {
  const sectionScores = SECTIONS.map(() => sectionScore(["FORMAL", "FORMAL", "FORMAL"]));
  sectionScores.forEach((s) => assert.equal(s, 75));

  const theoretical = theoreticalReadiness(sectionScores);
  assert.equal(theoretical, 0.75);
  assert.equal(readinessLevel(theoretical), "Operational");

  const divisor = exposureDivisor(true, "MULTI_COUNTRY", ["SEVERE"]);
  assert.equal(divisor, 2.5);

  const actual = actualReadiness(theoretical, divisor);
  assert.equal(actual, 0.3);
  assert.equal(readinessLevel(actual), "Fragile");
  assert.equal(
    actualReadinessSummary(actual),
    "Not sufficient for operating context and activities"
  );
});

test("sectionScore excludes N/A and averages the rest", () => {
  assert.equal(sectionScore(["EMBEDDED", "EMBEDDED", "NA"]), 100);
  assert.equal(sectionScore(["NONE", "EMBEDDED"]), 50);
  assert.equal(sectionScore(["NA", "NA"]), 0);
  assert.equal(sectionScore([]), 0);
});

test("sectionPriority thresholds", () => {
  assert.equal(sectionPriority(49), "High");
  assert.equal(sectionPriority(50), "Medium");
  assert.equal(sectionPriority(70), "Medium");
  assert.equal(sectionPriority(70.01), "Low");
});

test("readinessLevel bands", () => {
  assert.equal(readinessLevel(0.29), "Critical");
  assert.equal(readinessLevel(0.3), "Fragile");
  assert.equal(readinessLevel(0.49), "Fragile");
  assert.equal(readinessLevel(0.5), "Developing");
  assert.equal(readinessLevel(0.69), "Developing");
  assert.equal(readinessLevel(0.7), "Operational");
  assert.equal(readinessLevel(0.84), "Operational");
  assert.equal(readinessLevel(0.85), "Mature");
});

test("exposureDivisor: no high-risk activity, single site, no countries -> 1", () => {
  assert.equal(exposureDivisor(false, "SINGLE_SITE", []), 1);
});

test("exposureDivisor: takes the max country risk across multiple countries", () => {
  const divisor = exposureDivisor(false, "SINGLE_SITE", ["LOW", "SEVERE", "MODERATE"]);
  assert.equal(divisor, 1.8);
});

test("actualReadiness handles zero divisor safely", () => {
  assert.equal(actualReadiness(0.75, 0), 0);
});

test("per-country informational readiness and status", () => {
  const adjusted = countryAdjustedReadiness(0.75, "SEVERE");
  assert.ok(Math.abs(adjusted - 0.41666666666666663) < 1e-9);
  assert.equal(countryStatus(adjusted), "Not sufficient");
  assert.equal(countryStatus(0.6), "Needs strengthening");
  assert.equal(countryStatus(0.8), "Suitable");
});
