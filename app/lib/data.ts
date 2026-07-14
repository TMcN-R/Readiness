import "server-only";
import { notFound } from "next/navigation";
import { prisma } from "./prisma";
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
  type Answer,
  type Section,
} from "./scoring";

export async function getOrganisationByToken(token: string) {
  return prisma.organisation.findUnique({ where: { accessToken: token } });
}

/** Looks up an organisation by its access token, or renders a 404 if the token is invalid. */
export async function requireOrganisationByToken(token: string) {
  const org = await getOrganisationByToken(token);
  if (!org) notFound();
  return org;
}

export async function getOrganisationById(id: string) {
  return prisma.organisation.findUnique({ where: { id } });
}

export async function listOrganisations() {
  return prisma.organisation.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getQuestions() {
  return prisma.question.findMany({ orderBy: { order: "asc" } });
}

export async function getResponses(organisationId: string) {
  return prisma.response.findMany({ where: { organisationId } });
}

export async function getCountries(organisationId: string) {
  return prisma.country.findMany({ where: { organisationId }, orderBy: { createdAt: "asc" } });
}

export async function getActivityExposure(organisationId: string) {
  return prisma.activityExposure.findUnique({ where: { organisationId } });
}

export async function computeDashboard(organisationId: string) {
  const [questions, responses, countries, activity] = await Promise.all([
    getQuestions(),
    getResponses(organisationId),
    getCountries(organisationId),
    getActivityExposure(organisationId),
  ]);

  const answerByQuestionId = new Map(responses.map((r) => [r.questionId, r.answer as Answer]));

  const sectionScores = SECTIONS.map((section) => {
    const answers = questions
      .filter((q) => q.section === section)
      .map((q) => answerByQuestionId.get(q.id))
      .filter((a): a is Answer => a !== undefined);
    return { section, score: sectionScore(answers) };
  });

  const theoretical = theoreticalReadiness(sectionScores.map((s) => s.score));
  const theoreticalLevel = readinessLevel(theoretical);

  const countryRiskLevels = countries
    .map((c) => c.riskLevel)
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const divisor = exposureDivisor(
    activity?.highRiskActivity ?? false,
    activity?.operationalFootprint ?? "SINGLE_SITE",
    countryRiskLevels
  );

  const actual = actualReadiness(theoretical, divisor);
  const actualLevel = readinessLevel(actual);
  const summary = actualReadinessSummary(actual);

  const answeredCount = responses.length;
  const totalQuestions = questions.length;

  const answerCounts: Record<Answer, number> = {
    NONE: 0,
    AD_HOC: 0,
    PARTIAL: 0,
    FORMAL: 0,
    EMBEDDED: 0,
    NA: 0,
  };
  for (const r of responses) {
    answerCounts[r.answer as Answer]++;
  }

  const countryBreakdown = countries.map((c) => {
    if (!c.riskLevel) {
      return { ...c, adjustedReadiness: null, status: null as null | string };
    }
    const adjusted = countryAdjustedReadiness(theoretical, c.riskLevel);
    return { ...c, adjustedReadiness: adjusted, status: countryStatus(adjusted) };
  });

  return {
    theoretical,
    theoreticalLevel,
    actual,
    actualLevel,
    summary,
    exposureDivisor: divisor,
    countryRiskLevels,
    sectionScores: sectionScores.map((s) => ({
      ...s,
      priority: sectionPriority(s.score),
    })),
    answeredCount,
    totalQuestions,
    answerCounts,
    countryBreakdown,
    activity,
  };
}

export function groupQuestionsBySection<T extends { section: Section }>(questions: T[]) {
  return SECTIONS.map((section) => ({
    section,
    questions: questions.filter((q) => q.section === section),
  }));
}
