import Image from "next/image";
import type { computeDashboard } from "@/app/lib/data";
import {
  recommendCoreStoneTier,
  describeExposure,
  CORESTONE_TIERS,
  CORESTONE_TIER_INFO,
} from "@/app/lib/corestone";
import type { Section, SectionPriority } from "@/app/lib/scoring";

type Dashboard = Awaited<ReturnType<typeof computeDashboard>>;

type Org = {
  name: string;
  consultantName: string | null;
  consultantEmail: string | null;
};

const SECTION_LABEL: Record<Section, string> = {
  GOVERNANCE: "Governance",
  RISK: "Risk",
  SECURITY: "Security",
  CRISIS: "Crisis",
  BCP: "Business Continuity",
  PEOPLE: "People",
  OPERATIONS: "Operations",
  ASSURANCE: "Assurance",
};

const SECTION_FOCUS: Record<Section, string> = {
  GOVERNANCE: "Strengthen leadership accountability and oversight",
  RISK: "Formalise and consistently apply risk assessment processes",
  SECURITY: "Strengthen security planning and incident reporting",
  CRISIS: "Establish and test crisis management capability",
  BCP: "Develop business continuity planning and recovery capability",
  PEOPLE: "Improve staff training and preparedness for higher-risk environments",
  OPERATIONS: "Standardise operational processes and strengthen supervision",
  ASSURANCE: "Strengthen review processes and integration of lessons learned",
};

const PRIORITY_RANK = { High: 0, Medium: 1, Low: 2 } as const;

export default function ReadinessReport({ org, dashboard }: { org: Org; dashboard: Dashboard }) {
  const priorityAreas = [...dashboard.sectionScores].sort(
    (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
  );

  const exposureDescription = describeExposure(
    dashboard.activity?.highRiskActivity ?? false,
    dashboard.activity?.operationalFootprint ?? "SINGLE_SITE",
    dashboard.countryRiskLevels
  );

  const recommendation = recommendCoreStoneTier(
    dashboard.actualLevel,
    dashboard.exposureDivisor,
    exposureDescription
  );

  const generatedDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-8 print:gap-6">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4 print:pb-3">
        <Image src="/maravi-logo.png" alt="Maravi Group" width={160} height={37} />
        <div className="text-right text-xs text-zinc-500">
          <div className="font-medium text-zinc-700">{org.name}</div>
          <div>Generated {generatedDate}</div>
        </div>
      </div>

      <div>
        <h1 className="mb-2 text-xl font-semibold text-zinc-900">Readiness Report</h1>
        <p className="text-sm text-zinc-600">
          This report summarises the organisation&apos;s risk, security, and resilience
          readiness, the priority areas for improvement, and the recommended level of Maravi
          support to close the gap between current capability and operational demands.
        </p>
      </div>

      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm print:break-inside-avoid print:shadow-none">
        <h2 className="mb-3 text-base font-semibold text-zinc-900">Executive summary</h2>
        <p className="text-sm text-zinc-700">
          Theoretical readiness: <strong>{Math.round(dashboard.theoretical * 100)}%</strong>{" "}
          ({dashboard.theoreticalLevel}) &middot; Actual readiness:{" "}
          <strong>{Math.round(dashboard.actual * 100)}%</strong> ({dashboard.actualLevel})
        </p>
        <p className="mt-2 text-sm text-zinc-600">{dashboard.summary}</p>
        <p className="mt-3 text-sm text-zinc-600">
          A significant difference between theoretical and actual readiness typically indicates
          that the level of operational exposure exceeds current organisational capability. This
          does not necessarily indicate weak systems, but rather that the demands of the
          operating context are higher than those systems are currently designed to support.
        </p>
      </section>

      <section className="print:break-inside-avoid">
        <h2 className="mb-3 text-base font-semibold text-zinc-900">Section scores</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {dashboard.sectionScores.map((s) => (
            <div
              key={s.section}
              className="flex items-center justify-between rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm"
            >
              <span className="text-zinc-800">{SECTION_LABEL[s.section]}</span>
              <span className="flex items-center gap-2">
                <span className="text-zinc-500">{Math.round(s.score)}%</span>
                <PriorityBadge priority={s.priority} />
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="print:break-inside-avoid">
        <h2 className="mb-1 text-base font-semibold text-zinc-900">Priority areas</h2>
        <p className="mb-4 text-sm text-zinc-600">
          These areas represent the most important opportunities to strengthen capability in
          relation to the organisation&apos;s current operating context, in order of priority.
        </p>
        <ol className="flex flex-col gap-3">
          {priorityAreas.map((s, i) => (
            <li
              key={s.section}
              className="flex items-start gap-4 rounded-lg border border-zinc-200 bg-white p-4 print:break-inside-avoid"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-medium text-white">
                {i + 1}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-zinc-900">{SECTION_LABEL[s.section]}</span>
                  <PriorityBadge priority={s.priority} />
                </div>
                <p className="mt-1 text-sm text-zinc-600">{SECTION_FOCUS[s.section]}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="print:break-inside-avoid">
        <h2 className="mb-1 text-base font-semibold text-zinc-900">Recommended level of support</h2>
        <p className="mb-4 text-sm text-zinc-600">{recommendation.rationale}</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {CORESTONE_TIERS.map((tier) => {
            const info = CORESTONE_TIER_INFO[tier];
            const isRecommended = tier === recommendation.tier;
            return (
              <div
                key={tier}
                className={`rounded-lg p-4 ${
                  isRecommended
                    ? "border-2 border-zinc-900 bg-white"
                    : "border border-zinc-200 bg-white"
                }`}
              >
                {isRecommended && (
                  <div className="mb-2 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    Recommended
                  </div>
                )}
                <h3 className="font-medium text-zinc-900">{info.name}</h3>
                <p className="mt-1 text-xs text-zinc-600">{info.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm print:break-inside-avoid print:shadow-none">
        <h2 className="mb-2 text-base font-semibold text-zinc-900">Getting started</h2>
        <p className="text-sm text-zinc-600">
          To discuss these results, explore what they mean in practice, and agree priorities for
          strengthening readiness, please contact your Maravi consultant
          {org.consultantName ? `, ${org.consultantName}` : ""}
          {org.consultantEmail ? ` (${org.consultantEmail})` : ""}.
        </p>
        <p className="mt-2 text-sm text-zinc-500">www.maravigroup.com &middot; contact@maravigroup.com</p>
      </section>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: SectionPriority }) {
  const styles: Record<SectionPriority, string> = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-amber-100 text-amber-700",
    Low: "bg-emerald-100 text-emerald-700",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[priority]}`}>
      {priority} priority
    </span>
  );
}
