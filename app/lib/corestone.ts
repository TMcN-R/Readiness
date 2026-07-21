import { SECTION_LABEL, readinessLevel } from "./scoring";
import type { OperationalFootprint, ReadinessLevel, RiskLevel, Section } from "./scoring";

export type CoreStoneTier = "RISK_FOUNDATIONS" | "RESILIENCE_PARTNER" | "STRATEGIC_ALLIANCE";

export const CORESTONE_TIERS: CoreStoneTier[] = [
  "RISK_FOUNDATIONS",
  "RESILIENCE_PARTNER",
  "STRATEGIC_ALLIANCE",
];

export type CoreStoneCatalogEntry = {
  name: string;
  description: string;
  /** Standard annual fee (USD) - always a direct lookup, never computed from a score. */
  standardFee: number;
  feeBandLow: number;
  feeBandHigh: number;
  days: number;
  /** How many Improvement Sprints this tier includes. */
  sprintSlots: number;
  /** The full set of sprint themes this tier can choose from. */
  sprintThemes: string[];
  /** Other fixed components of the tier, shown as-is - never invented. */
  fixedComponents: string[];
};

/**
 * Maravi's fixed CoreStone tier catalog: fees, bands, and named components.
 * Edit this object to change tier contents/pricing - scoring and rendering
 * logic elsewhere never need to change alongside it.
 */
export const CORESTONE_CATALOG: Record<CoreStoneTier, CoreStoneCatalogEntry> = {
  RISK_FOUNDATIONS: {
    name: "Risk Foundations",
    description:
      "A strong starting point for organisations seeking clarity, structure, and practical risk improvement without a heavy commitment.",
    standardFee: 6500,
    feeBandLow: 5500,
    feeBandHigh: 9500,
    days: 9,
    sprintSlots: 1,
    sprintThemes: [
      "SOP development",
      "Incident management process",
      "Travel risk procedures",
      "Safety action plan",
      "Crisis management checklist",
    ],
    fixedComponents: [
      "One annual security/safeguarding/risk review (current-arrangements review, prioritised recommendations, leadership debrief)",
      "One live security awareness briefing",
      "Light Ask-the-Advisor access",
      "Essential SRM templates",
    ],
  },
  RESILIENCE_PARTNER: {
    name: "Resilience Partner",
    description:
      "An embedded, year-round partnership for organisations managing ongoing risks and reducing reliance on reactive responses.",
    standardFee: 21000,
    feeBandLow: 18000,
    feeBandHigh: 28000,
    days: 28,
    sprintSlots: 3,
    sprintThemes: [
      "Safety strengthening",
      "Duty-of-care improvements",
      "Incident management enhancements",
      "Crisis management capability",
      "Risk governance",
      "Business continuity planning",
    ],
    fixedComponents: [
      "Annual Risk & Resilience Journey (start/mid/end-of-year review + roadmap)",
      "Incident support, up to 2 significant incidents/year",
      "Four quarterly briefings",
      "Expanded NGO-Ready Toolkit",
      "Standard Ask-the-Advisor access, two security awareness briefings",
    ],
  },
  STRATEGIC_ALLIANCE: {
    name: "Strategic Alliance",
    description:
      "A strategic partnership for complex portfolios requiring senior advisory input, programme-wide oversight, and long-term resilience support.",
    standardFee: 42000,
    feeBandLow: 35000,
    feeBandHigh: 60000,
    days: 56,
    sprintSlots: 5,
    sprintThemes: [
      "Enterprise risk management",
      "Safety transformation",
      "Crisis management capability programmes",
      "Security management system enhancements",
      "Access and acceptance strategies",
      "Leadership decision-making frameworks",
    ],
    fixedComponents: [
      "Multi-country support (up to 3 countries)",
      "Incident support, up to 4 significant incidents, priority engagement",
      "Quarterly executive briefings + 12 monthly check-ins",
      "Bespoke tools, unlimited Ask-the-Advisor access, four awareness briefings",
    ],
  },
};

/**
 * Which Improvement Sprint theme addresses which assessment domain, per tier.
 * Maravi's official mapping. Known gaps (confirmed, not silently invented):
 * BCP has no dedicated theme at Risk Foundations or Strategic Alliance, and
 * Assurance has no dedicated theme at Risk Foundations - both fall back to a
 * related theme below.
 */
export const DOMAIN_TO_SPRINT_MAP: Record<Section, Record<CoreStoneTier, string>> = {
  GOVERNANCE: {
    RISK_FOUNDATIONS: "SOP development",
    RESILIENCE_PARTNER: "Risk governance",
    STRATEGIC_ALLIANCE: "Leadership decision-making frameworks",
  },
  RISK: {
    RISK_FOUNDATIONS: "SOP development",
    RESILIENCE_PARTNER: "Risk governance",
    STRATEGIC_ALLIANCE: "Enterprise risk management",
  },
  SECURITY: {
    RISK_FOUNDATIONS: "Travel risk procedures",
    RESILIENCE_PARTNER: "Duty-of-care improvements",
    STRATEGIC_ALLIANCE: "Security management system enhancements",
  },
  CRISIS: {
    RISK_FOUNDATIONS: "Crisis management checklist",
    RESILIENCE_PARTNER: "Crisis management capability",
    STRATEGIC_ALLIANCE: "Crisis management capability programmes",
  },
  BCP: {
    RISK_FOUNDATIONS: "Crisis management checklist", // fallback - no dedicated Risk Foundations theme
    RESILIENCE_PARTNER: "Business continuity planning",
    STRATEGIC_ALLIANCE: "Enterprise risk management", // fallback - no dedicated Strategic Alliance theme
  },
  PEOPLE: {
    RISK_FOUNDATIONS: "Safety action plan",
    RESILIENCE_PARTNER: "Safety strengthening",
    STRATEGIC_ALLIANCE: "Safety transformation",
  },
  OPERATIONS: {
    RISK_FOUNDATIONS: "Incident management process",
    RESILIENCE_PARTNER: "Incident management enhancements",
    STRATEGIC_ALLIANCE: "Access and acceptance strategies",
  },
  ASSURANCE: {
    RISK_FOUNDATIONS: "SOP development", // fallback - no dedicated Risk Foundations theme
    RESILIENCE_PARTNER: "Risk governance",
    STRATEGIC_ALLIANCE: "Enterprise risk management",
  },
};

/**
 * Maps the organisation's weakest domains (weakest first) to this tier's sprint
 * themes, de-duplicates - a repeated theme is a signal to prioritise it, not an
 * error - and caps at the tier's actual sprint slot count.
 */
export function selectComponents(tier: CoreStoneTier, weakestDomains: Section[]): string[] {
  const themes = weakestDomains.map((domain) => DOMAIN_TO_SPRINT_MAP[domain][tier]);
  const deduped = [...new Set(themes)];
  return deduped.slice(0, CORESTONE_CATALOG[tier].sprintSlots);
}

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

const BOUNDARY_READINESS_EPSILON = 0.03;
const BOUNDARY_DIVISOR_EPSILON = 0.1;

/**
 * Detects whether the org sits close enough to a readiness- or complexity-band
 * edge that a small change in either would flip the recommended tier. Nudges
 * both metrics in both directions and re-runs the real tier logic, rather than
 * hand-duplicating the band edges as separate constants that could drift out
 * of sync with the actual bands in scoring.ts.
 */
export function boundaryTier(actualFraction: number, divisor: number): CoreStoneTier | null {
  const primary = recommendedTier(readinessLevel(actualFraction), divisor);

  const candidates = [
    recommendedTier(readinessLevel(actualFraction + BOUNDARY_READINESS_EPSILON), divisor),
    recommendedTier(readinessLevel(actualFraction - BOUNDARY_READINESS_EPSILON), divisor),
    recommendedTier(readinessLevel(actualFraction), divisor + BOUNDARY_DIVISOR_EPSILON),
    recommendedTier(readinessLevel(actualFraction), divisor - BOUNDARY_DIVISOR_EPSILON),
  ];

  return candidates.find((c) => c !== primary) ?? null;
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

function formatList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export const CORESTONE_DISCLAIMER =
  "This is an indicative recommendation and fee range based on your responses, not a formal quote or scope of work. The full scope of work, deliverables, and final fee are agreed directly between your organisation and Maravi before any engagement begins.";

export type IndicativeRecommendation = {
  tier: CoreStoneTier;
  name: string;
  description: string;
  rationale: string;
  selectedComponents: string[];
  standardFee: number;
  feeBandLow: number;
  feeBandHigh: number;
  days: number;
  boundaryTier: CoreStoneTier | null;
  disclaimer: string;
  modularNote: string;
};

/**
 * Builds the full indicative CoreStone recommendation from the assessment's
 * own scoring output. Reads from computeDashboard()'s results - never
 * recomputes or reinterprets the underlying score.
 */
export function generateIndicativeRecommendation(params: {
  actualLevel: ReadinessLevel;
  actualFraction: number;
  divisor: number;
  exposureDescription: string;
  sectionScores: { section: Section; score: number }[];
}): IndicativeRecommendation {
  const { actualLevel, actualFraction, divisor, exposureDescription, sectionScores } = params;

  const tier = recommendedTier(actualLevel, divisor);
  const catalog = CORESTONE_CATALOG[tier];

  const weakestDomains = [...sectionScores]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((s) => s.section);

  const selectedComponents = selectComponents(tier, weakestDomains);
  const weakestLabels = formatList(weakestDomains.map((d) => SECTION_LABEL[d]));

  const rationale =
    `Your Actual Readiness is ${actualLevel}, with your weakest areas being ${weakestLabels}. ` +
    `Your operating context reflects ${exposureDescription}. Based on this profile, ${catalog.name} ` +
    `looks like the strongest starting point.`;

  const modularNote =
    "This is modular: you can start narrower - Risk Foundations, or a single sprint focus - and scale up as needs grow, rather than treating this as all-or-nothing.";

  return {
    tier,
    name: catalog.name,
    description: catalog.description,
    rationale,
    selectedComponents,
    standardFee: catalog.standardFee,
    feeBandLow: catalog.feeBandLow,
    feeBandHigh: catalog.feeBandHigh,
    days: catalog.days,
    boundaryTier: boundaryTier(actualFraction, divisor),
    disclaimer: CORESTONE_DISCLAIMER,
    modularNote,
  };
}
