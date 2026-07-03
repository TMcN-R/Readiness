import Link from "next/link";
import { requireOrganisationByToken, computeDashboard } from "@/app/lib/data";
import type { SectionPriority } from "@/app/lib/scoring";

const SECTION_LABEL: Record<string, string> = {
  GOVERNANCE: "Governance",
  RISK: "Risk",
  SECURITY: "Security",
  CRISIS: "Crisis",
  BCP: "Business Continuity",
  PEOPLE: "People",
  OPERATIONS: "Operations",
  ASSURANCE: "Assurance",
};

function pct(fraction: number) {
  return `${Math.round(fraction * 100)}%`;
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const org = await requireOrganisationByToken(token);
  const dashboard = await computeDashboard(org.id);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="mb-2 text-xl font-semibold text-zinc-900">Step 4: Dashboard</h1>
        <p className="text-sm text-zinc-600">
          Results are calculated automatically from your answers in Steps 1&ndash;3. Actual
          readiness reflects your capability adjusted for context &mdash; including the nature
          of your activities, operational complexity, and the countries you work in.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ScoreCard
          label="Theoretical Readiness"
          value={pct(dashboard.theoretical)}
          level={dashboard.theoreticalLevel}
          description="What capability you have in place."
        />
        <ScoreCard
          label="Actual Readiness"
          value={pct(dashboard.actual)}
          level={dashboard.actualLevel}
          description="Whether that capability is sufficient for your operating context."
        />
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-zinc-900">{dashboard.summary}</p>
      </div>

      <section>
        <h2 className="mb-3 text-base font-semibold text-zinc-900">Section scores</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {dashboard.sectionScores.map((s) => (
            <div
              key={s.section}
              className="flex items-center justify-between rounded-md border border-zinc-200 bg-white px-4 py-3"
            >
              <span className="text-sm text-zinc-800">{SECTION_LABEL[s.section]}</span>
              <span className="flex items-center gap-2">
                <span className="text-sm text-zinc-500">{Math.round(s.score)}%</span>
                <PriorityBadge priority={s.priority} />
              </span>
            </div>
          ))}
        </div>
      </section>

      {dashboard.countryBreakdown.length > 0 && (
        <section>
          <h2 className="mb-3 text-base font-semibold text-zinc-900">Country risk</h2>
          <div className="flex flex-col gap-2">
            {dashboard.countryBreakdown.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm"
              >
                <span className="text-zinc-800">{c.name}</span>
                <span className="text-zinc-500">
                  {c.status ?? "Pending consultant review"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div>
        <Link
          href={`/assessment/${token}/results`}
          className="inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Continue to Step 5 &rarr;
        </Link>
      </div>
    </div>
  );
}

function ScoreCard({
  label,
  value,
  level,
  description,
}: {
  label: string;
  value: string;
  level: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-1 text-3xl font-semibold text-zinc-900">{value}</div>
      <div className="mt-1 text-sm font-medium text-zinc-700">{level}</div>
      <p className="mt-2 text-xs text-zinc-500">{description}</p>
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
      {priority}
    </span>
  );
}
