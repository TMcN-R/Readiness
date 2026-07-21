export type Section =
  | "GOVERNANCE"
  | "RISK"
  | "SECURITY"
  | "CRISIS"
  | "BCP"
  | "PEOPLE"
  | "OPERATIONS"
  | "ASSURANCE";

export type Answer = "NONE" | "AD_HOC" | "PARTIAL" | "FORMAL" | "EMBEDDED" | "NA";

export type RiskLevel = "LOW" | "MODERATE" | "ELEVATED" | "SEVERE";

export type OperationalFootprint = "SINGLE_SITE" | "MULTIPLE_SITES" | "MULTI_COUNTRY";

export type ReadinessLevel = "Critical" | "Fragile" | "Developing" | "Operational" | "Mature";

export const SECTIONS: Section[] = [
  "GOVERNANCE",
  "RISK",
  "SECURITY",
  "CRISIS",
  "BCP",
  "PEOPLE",
  "OPERATIONS",
  "ASSURANCE",
];

export const SECTION_LABEL: Record<Section, string> = {
  GOVERNANCE: "Governance",
  RISK: "Risk",
  SECURITY: "Security",
  CRISIS: "Crisis",
  BCP: "Business Continuity",
  PEOPLE: "People",
  OPERATIONS: "Operations",
  ASSURANCE: "Assurance",
};

const ANSWER_SCORE: Record<Answer, number | null> = {
  NONE: 0,
  AD_HOC: 1,
  PARTIAL: 2,
  FORMAL: 3,
  EMBEDDED: 4,
  NA: null,
};

const RISK_MULTIPLIER: Record<RiskLevel, number> = {
  LOW: 1,
  MODERATE: 1.2,
  ELEVATED: 1.5,
  SEVERE: 1.8,
};

const FOOTPRINT_MULTIPLIER: Record<OperationalFootprint, number> = {
  SINGLE_SITE: 1,
  MULTIPLE_SITES: 1.2,
  MULTI_COUNTRY: 1.4,
};

const HIGH_RISK_ACTIVITY_MULTIPLIER = 1.8;
const MAX_EXPOSURE_DIVISOR = 2.5;

export function countryRiskMultiplier(riskLevel: RiskLevel): number {
  return RISK_MULTIPLIER[riskLevel];
}

export function footprintMultiplier(footprint: OperationalFootprint): number {
  return FOOTPRINT_MULTIPLIER[footprint];
}

export function activityMultiplier(highRiskActivity: boolean): number {
  return highRiskActivity ? HIGH_RISK_ACTIVITY_MULTIPLIER : 1;
}

/** Section score as a percentage (0-100), averaging answered questions (N/A excluded). */
export function sectionScore(answers: Answer[]): number {
  const scores = answers
    .map((a) => ANSWER_SCORE[a])
    .filter((s): s is number => s !== null);
  if (scores.length === 0) return 0;
  const average = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  return (average / 4) * 100;
}

export type SectionPriority = "High" | "Medium" | "Low";

export function sectionPriority(score: number): SectionPriority {
  if (score < 50) return "High";
  if (score <= 70) return "Medium";
  return "Low";
}

/** Theoretical readiness as a fraction (0-1): the average of the 8 section scores. */
export function theoreticalReadiness(sectionScores: number[]): number {
  if (sectionScores.length === 0) return 0;
  const average = sectionScores.reduce((sum, s) => sum + s, 0) / sectionScores.length;
  return average / 100;
}

export function readinessLevel(fraction: number): ReadinessLevel {
  if (fraction < 0.3) return "Critical";
  if (fraction < 0.5) return "Fragile";
  if (fraction < 0.7) return "Developing";
  if (fraction < 0.85) return "Operational";
  return "Mature";
}

/** Combined exposure divisor, capped at 2.5 per the workbook's methodology. */
export function exposureDivisor(
  highRiskActivity: boolean,
  footprint: OperationalFootprint,
  countryRiskLevels: RiskLevel[]
): number {
  const maxCountryMultiplier =
    countryRiskLevels.length === 0
      ? 1
      : Math.max(...countryRiskLevels.map(countryRiskMultiplier));
  const raw =
    activityMultiplier(highRiskActivity) *
    footprintMultiplier(footprint) *
    Math.max(maxCountryMultiplier, 1);
  return Math.min(raw, MAX_EXPOSURE_DIVISOR);
}

export function actualReadiness(theoretical: number, divisor: number): number {
  if (!divisor) return 0;
  return theoretical / divisor;
}

export function actualReadinessSummary(actualFraction: number): string {
  if (actualFraction < 0.5) return "Not sufficient for operating context and activities";
  if (actualFraction < 0.7) return "Capability present but requires strengthening";
  return "Capability broadly appropriate for current risk profile";
}

/** Per-country informational readiness: theoretical divided by that country's own multiplier. Not used in the overall Actual Readiness figure. */
export function countryAdjustedReadiness(theoretical: number, riskLevel: RiskLevel): number {
  return theoretical / countryRiskMultiplier(riskLevel);
}

export type CountryStatus = "Not sufficient" | "Needs strengthening" | "Suitable";

export function countryStatus(adjustedFraction: number): CountryStatus {
  if (adjustedFraction < 0.5) return "Not sufficient";
  if (adjustedFraction < 0.7) return "Needs strengthening";
  return "Suitable";
}
