import { test } from "node:test";
import assert from "node:assert/strict";
import {
  complexityBand,
  recommendedTier,
  describeExposure,
  recommendCoreStoneTier,
  CORESTONE_TIER_INFO,
} from "./corestone";
import type { ReadinessLevel } from "./scoring";

test("complexityBand boundaries", () => {
  assert.equal(complexityBand(1), "Low");
  assert.equal(complexityBand(1.39), "Low");
  assert.equal(complexityBand(1.4), "Medium");
  assert.equal(complexityBand(1.99), "Medium");
  assert.equal(complexityBand(2.0), "High");
  assert.equal(complexityBand(2.5), "High");
});

test("recommendedTier: full 9-combination rule table", () => {
  const cases: [ReadinessLevel, number, string][] = [
    // Critical/Fragile (poor)
    ["Critical", 1.0, "RESILIENCE_PARTNER"],
    ["Fragile", 1.5, "RESILIENCE_PARTNER"],
    ["Critical", 2.5, "STRATEGIC_ALLIANCE"],
    // Developing
    ["Developing", 1.0, "RISK_FOUNDATIONS"],
    ["Developing", 1.5, "RESILIENCE_PARTNER"],
    ["Developing", 2.0, "STRATEGIC_ALLIANCE"],
    // Operational/Mature (good)
    ["Operational", 1.0, "RISK_FOUNDATIONS"],
    ["Mature", 1.5, "RISK_FOUNDATIONS"],
    ["Operational", 2.5, "RESILIENCE_PARTNER"],
  ];

  for (const [level, divisor, expected] of cases) {
    assert.equal(
      recommendedTier(level, divisor),
      expected,
      `${level} @ divisor ${divisor} should be ${expected}`
    );
  }
});

test("describeExposure includes activity, footprint, and highest severe/elevated country", () => {
  const desc = describeExposure(true, "MULTI_COUNTRY", ["LOW", "SEVERE", "MODERATE"]);
  assert.match(desc, /high-risk activity/);
  assert.match(desc, /multi-country/);
  assert.match(desc, /Severe-risk country/);
});

test("describeExposure omits country mention when risk is low/moderate", () => {
  const desc = describeExposure(false, "SINGLE_SITE", ["LOW", "MODERATE"]);
  assert.match(desc, /standard \(non-high-risk\) activity/);
  assert.doesNotMatch(desc, /risk country/);
});

test("describeExposure handles no countries entered", () => {
  const desc = describeExposure(false, "SINGLE_SITE", []);
  assert.doesNotMatch(desc, /risk country/);
});

test("recommendCoreStoneTier returns matching tier info and a rationale mentioning the level", () => {
  const rec = recommendCoreStoneTier("Fragile", 2.5, "high-risk activity across multi-country operations");
  assert.equal(rec.tier, "STRATEGIC_ALLIANCE");
  assert.equal(rec.name, CORESTONE_TIER_INFO.STRATEGIC_ALLIANCE.name);
  assert.equal(rec.description, CORESTONE_TIER_INFO.STRATEGIC_ALLIANCE.description);
  assert.match(rec.rationale, /Fragile/);
  assert.match(rec.rationale, /Strategic Alliance/);
});
