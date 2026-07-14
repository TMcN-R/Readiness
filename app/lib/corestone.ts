import type { OperationalFootprint, ReadinessLevel, RiskLevel } from "./scoring";

export type CoreStoneTier = "RISK_FOUNDATIONS" | "RESILIENCE_PARTNER" | "STRATEGIC_ALLIANCE";

export const CORESTONE_TIERS: CoreStoneTier[] = [
  "RISK_FOUNDATIONS",
  "RESILIENCE_PARTNER",
  "STRATEGIC_ALLIANCE",
];

export const CORESTONE_TIER_INFO: Record<CoreStoneTier, { name: string; description: string }> = {
  RISK_FOUNDATIONS: {
    name: "Risk Foundations",
    description:
      "A strong starting point for organisations seeking clarity, structure, and practical risk improvement without a heavy commitment.",
  },
  RESILIENCE_PARTNER: {
    name: "Resilience Partner",
    description:
      "An embedded, year-round partnership for organisations managing ongoing risks and reducing reliance on reactive responses.",
  },
  STRATEGIC_ALLIANCE: {
    name: "Strategic Alliance",
    description:
      "A strategic partnership for complex portfolios requiring senior advisory input, programme-wide oversight, and long-term resilience support.",
  },
};

export type ComplexityBand = "Low" | "Medium" | "High";

/** Bands the exposure divisor (1-2.5) into a qualitative complexity level. */
export function complexityBand(divisor: number): ComplexityBand {
  if (divisor >= 2.0) return "High";
  if (divisor >= 1.4) return "Medium";
  return "Low";
}

const READINESS_ROW: Record<ReadinessLevel, "poor" | "developing" | "good"> = {
  Critical: "poor",
  Fragile: "poor",
  Developing: "developing",
  Operational: "good",
  Mature: "good",
};

const RULE_TABLE: Record<"poor" | "developing" | "good", Record<ComplexityBand, CoreStoneTier>> = {
  poor: { Low: "RESILIENCE_PARTNER", Medium: "RESILIENCE_PARTNER", High: "STRATEGIC_ALLIANCE" },
  developing: { Low: "RISK_FOUNDATIONS", Medium: "RESILIENCE_PARTNER", High: "STRATEGIC_ALLIANCE" },
  good: { Low: "RISK_FOUNDATIONS", Medium: "RISK_FOUNDATIONS", High: "RESILIENCE_PARTNER" },
};

/** Picks the CoreStone tier for a given actual-readiness level and exposure divisor. */
export function recommendedTier(actualLevel: ReadinessLevel, divisor: number): CoreStoneTier {
  return RULE_TABLE[READINESS_ROW[actualLevel]][complexityBand(divisor)];
}

const FOOTPRINT_PHRASE: Record<OperationalFootprint, string> = {
  SINGLE_SITE: "a single operational site",
  MULTIPLE_SITES: "multiple sites within one country",
  MULTI_COUNTRY: "multi-country or remote operations",
};

const RISK_LEVEL_LABEL: Record<RiskLevel, string> = {
  LOW: "Low",
  MODERATE: "Moderate",
  ELEVATED: "Elevated",
  SEVERE: "Severe",
};

const RISK_RANK: Record<RiskLevel, number> = { LOW: 0, MODERATE: 1, ELEVATED: 2, SEVERE: 3 };

/** A short human-readable description of the org's operating context, for the report narrative. */
export function describeExposure(
  highRiskActivity: boolean,
  footprint: OperationalFootprint,
  countryRiskLevels: RiskLevel[]
): string {
  const parts: string[] = [];
  parts.push(highRiskActivity ? "high-risk activity" : "standard (non-high-risk) activity");
  parts.push(FOOTPRINT_PHRASE[footprint]);

  let description = `${parts[0]} across ${parts[1]}`;

  if (countryRiskLevels.length > 0) {
    const highest = countryRiskLevels.reduce((a, b) => (RISK_RANK[b] > RISK_RANK[a] ? b : a));
    if (RISK_RANK[highest] >= RISK_RANK.ELEVATED) {
      description += `, including operations in a ${RISK_LEVEL_LABEL[highest]}-risk country`;
    }
  }

  return description;
}

export type CoreStoneRecommendation = {
  tier: CoreStoneTier;
  name: string;
  description: string;
  rationale: string;
};

/** Full CoreStone recommendation with a generated rationale sentence for the report. */
export function recommendCoreStoneTier(
  actualLevel: ReadinessLevel,
  divisor: number,
  exposureDescription: string
): CoreStoneRecommendation {
  const tier = recommendedTier(actualLevel, divisor);
  const { name, description } = CORESTONE_TIER_INFO[tier];
  const rationale =
    `Your Actual Readiness is ${actualLevel}, reflecting ${exposureDescription}. ` +
    `Based on this profile, we recommend ${name} as the level of engagement most likely ` +
    `to close the gap between your current capability and the demands of your operating context.`;

  return { tier, name, description, rationale };
}
