import { test } from "node:test";
import assert from "node:assert/strict";
import {
  complexityBand,
  recommendedTier,
  describeExposure,
  boundaryTier,
  selectComponents,
  generateIndicativeRecommendation,
  CORESTONE_CATALOG,
  CORESTONE_TIERS,
  DOMAIN_TO_SPRINT_MAP,
  CORESTONE_DISCLAIMER,
} from "./corestone";
import { SECTIONS } from "./scoring";
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

test("CORESTONE_CATALOG matches Maravi's fixed fee/band/day/sprint-slot figures", () => {
  assert.deepEqual(
    {
      fee: CORESTONE_CATALOG.RISK_FOUNDATIONS.standardFee,
      low: CORESTONE_CATALOG.RISK_FOUNDATIONS.feeBandLow,
      high: CORESTONE_CATALOG.RISK_FOUNDATIONS.feeBandHigh,
      days: CORESTONE_CATALOG.RISK_FOUNDATIONS.days,
      slots: CORESTONE_CATALOG.RISK_FOUNDATIONS.sprintSlots,
    },
    { fee: 6500, low: 5500, high: 9500, days: 9, slots: 1 }
  );
  assert.deepEqual(
    {
      fee: CORESTONE_CATALOG.RESILIENCE_PARTNER.standardFee,
      low: CORESTONE_CATALOG.RESILIENCE_PARTNER.feeBandLow,
      high: CORESTONE_CATALOG.RESILIENCE_PARTNER.feeBandHigh,
      days: CORESTONE_CATALOG.RESILIENCE_PARTNER.days,
      slots: CORESTONE_CATALOG.RESILIENCE_PARTNER.sprintSlots,
    },
    { fee: 21000, low: 18000, high: 28000, days: 28, slots: 3 }
  );
  assert.deepEqual(
    {
      fee: CORESTONE_CATALOG.STRATEGIC_ALLIANCE.standardFee,
      low: CORESTONE_CATALOG.STRATEGIC_ALLIANCE.feeBandLow,
      high: CORESTONE_CATALOG.STRATEGIC_ALLIANCE.feeBandHigh,
      days: CORESTONE_CATALOG.STRATEGIC_ALLIANCE.days,
      slots: CORESTONE_CATALOG.STRATEGIC_ALLIANCE.sprintSlots,
    },
    { fee: 42000, low: 35000, high: 60000, days: 56, slots: 5 }
  );
});

test("DOMAIN_TO_SPRINT_MAP has all 8 sections mapped for all 3 tiers", () => {
  for (const section of SECTIONS) {
    for (const tier of CORESTONE_TIERS) {
      assert.equal(
        typeof DOMAIN_TO_SPRINT_MAP[section][tier],
        "string",
        `${section} x ${tier} should map to a theme`
      );
    }
  }
});

test("selectComponents de-duplicates and caps at the tier's sprint slot count", () => {
  // Risk Foundations has 1 slot - even 3 weak domains yield exactly 1 theme.
  const rf = selectComponents("RISK_FOUNDATIONS", ["SECURITY", "CRISIS", "OPERATIONS"]);
  assert.equal(rf.length, 1);
  assert.equal(rf[0], "Travel risk procedures");

  // GOVERNANCE and RISK share the same Resilience Partner theme ("Risk governance"),
  // so 3 weak domains collapse to 2 distinct themes, not 3.
  const rp = selectComponents("RESILIENCE_PARTNER", ["GOVERNANCE", "RISK", "BCP"]);
  assert.deepEqual(rp, ["Risk governance", "Business continuity planning"]);

  // Strategic Alliance has 5 slots - 3 distinct weak-domain themes all fit.
  const sa = selectComponents("STRATEGIC_ALLIANCE", ["SECURITY", "CRISIS", "PEOPLE"]);
  assert.equal(sa.length, 3);
});

test("boundaryTier returns null when comfortably inside a tier's bands", () => {
  // Mature readiness (>=0.85) with Low complexity (divisor well under 1.4) is
  // solidly Risk Foundations on every nudge.
  assert.equal(boundaryTier(0.95, 1.0), null);
});

test("boundaryTier returns the alternate tier near a band edge", () => {
  // 0.49 is one point inside Fragile (poor); nudging +0.03 crosses into
  // Developing (also poor's neighbour) but that alone doesn't change tier
  // unless complexity is also near its own edge. Use a divisor right at the
  // Medium/High complexity edge (2.0) so nudging it changes the tier.
  const result = boundaryTier(0.6, 1.95);
  assert.notEqual(result, null);
});

test("generateIndicativeRecommendation: fee is a direct catalog lookup, never derived", () => {
  const rec = generateIndicativeRecommendation({
    actualLevel: "Fragile",
    actualFraction: 0.35,
    divisor: 2.5,
    exposureDescription: "high-risk activity across multi-country operations",
    sectionScores: [
      { section: "SECURITY", score: 20 },
      { section: "CRISIS", score: 30 },
      { section: "GOVERNANCE", score: 90 },
      { section: "RISK", score: 90 },
      { section: "BCP", score: 90 },
      { section: "PEOPLE", score: 90 },
      { section: "OPERATIONS", score: 90 },
      { section: "ASSURANCE", score: 90 },
    ],
  });

  assert.equal(rec.tier, "STRATEGIC_ALLIANCE");
  assert.equal(rec.standardFee, CORESTONE_CATALOG.STRATEGIC_ALLIANCE.standardFee);
  assert.equal(rec.feeBandLow, CORESTONE_CATALOG.STRATEGIC_ALLIANCE.feeBandLow);
  assert.equal(rec.feeBandHigh, CORESTONE_CATALOG.STRATEGIC_ALLIANCE.feeBandHigh);
  assert.equal(rec.disclaimer, CORESTONE_DISCLAIMER);
  assert.ok(rec.selectedComponents.length <= CORESTONE_CATALOG.STRATEGIC_ALLIANCE.sprintSlots);
  assert.match(rec.rationale, /Fragile/);
  assert.match(rec.rationale, /Security/);
});
