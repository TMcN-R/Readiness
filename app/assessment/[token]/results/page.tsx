import { requireOrganisationByToken, computeDashboard } from "@/app/lib/data";
import type { Section } from "@/app/lib/scoring";

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

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const org = await requireOrganisationByToken(token);
  const dashboard = await computeDashboard(org.id);

  const priorityAreas = [...dashboard.sectionScores].sort(
    (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="mb-2 text-xl font-semibold text-zinc-900">
          Step 5: Acting on Your Results
        </h1>
        <p className="text-sm text-zinc-600">
          The priority areas identified below indicate where strengthening efforts should be
          focused in order to align capability with operational demands. Next steps should
          involve reviewing these areas in more detail with your Maravi consultant.
        </p>
      </div>

      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
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

      <section>
        <h2 className="mb-1 text-base font-semibold text-zinc-900">Priority areas</h2>
        <p className="mb-4 text-sm text-zinc-600">
          These areas represent the most important opportunities to strengthen capability in
          relation to your current operating context, in order of priority.
        </p>
        <ol className="flex flex-col gap-3">
          {priorityAreas.map((s, i) => (
            <li
              key={s.section}
              className="flex items-start gap-4 rounded-lg border border-zinc-200 bg-white p-4"
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

      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-base font-semibold text-zinc-900">Getting started</h2>
        <p className="text-sm text-zinc-600">
          To discuss your results, explore what they mean in practice, and agree priorities for
          strengthening readiness, please contact your Maravi consultant
          {org.consultantName ? `, ${org.consultantName}` : ""}
          {org.consultantEmail ? ` (${org.consultantEmail})` : ""}.
        </p>
        <p className="mt-2 text-sm text-zinc-500">www.maravi.co.uk &middot; info@maravi.co.uk</p>
      </section>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: "High" | "Medium" | "Low" }) {
  const styles = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-amber-100 text-amber-700",
    Low: "bg-emerald-100 text-emerald-700",
  } as const;
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[priority]}`}>
      {priority} priority
    </span>
  );
}
