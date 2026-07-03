import { notFound } from "next/navigation";
import { headers } from "next/headers";
import {
  getOrganisationById,
  getCountries,
  computeDashboard,
} from "@/app/lib/data";
import { setCountryRisk, updateOrganisationDetails } from "./actions";

const RISK_LEVELS = ["LOW", "MODERATE", "ELEVATED", "SEVERE"] as const;

function pct(fraction: number) {
  return `${Math.round(fraction * 100)}%`;
}

export default async function OrganisationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const org = await getOrganisationById(id);
  if (!org) notFound();

  const [countries, dashboard, headerList] = await Promise.all([
    getCountries(id),
    computeDashboard(id),
    headers(),
  ]);

  const host = headerList.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const assessmentUrl = host ? `${protocol}://${host}/assessment/${org.accessToken}` : "";

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">{org.name}</h1>
        {assessmentUrl && (
          <p className="mt-1 text-sm text-zinc-500">
            Client link: <code className="rounded bg-zinc-100 px-1.5 py-0.5">{assessmentUrl}</code>
          </p>
        )}
      </div>

      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-zinc-900">Readiness summary</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Theoretical readiness" value={pct(dashboard.theoretical)} sub={dashboard.theoreticalLevel} />
          <Stat label="Actual readiness" value={pct(dashboard.actual)} sub={dashboard.actualLevel} />
          <Stat
            label="Responses"
            value={`${dashboard.answeredCount}/${dashboard.totalQuestions}`}
            sub="questions answered"
          />
          <Stat label="Status" value={org.status.replace("_", " ")} sub="" />
        </div>
        <p className="mt-4 text-sm text-zinc-600">{dashboard.summary}</p>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {dashboard.sectionScores.map((s) => (
            <div
              key={s.section}
              className="flex items-center justify-between rounded-md border border-zinc-100 px-3 py-2 text-sm"
            >
              <span className="text-zinc-700">{s.section}</span>
              <span className="flex items-center gap-2">
                <span className="text-zinc-500">{Math.round(s.score)}%</span>
                <PriorityBadge priority={s.priority} />
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-base font-semibold text-zinc-900">Country risk</h2>
        <p className="mb-4 text-sm text-zinc-500">
          Set the risk level for each country the client has entered, using Maravi&apos;s
          country risk methodology.
        </p>
        {countries.length === 0 ? (
          <p className="text-sm text-zinc-500">The client hasn&apos;t entered any countries yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {countries.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-zinc-800">{c.name}</span>
                <form action={setCountryRisk} className="flex items-center gap-2">
                  <input type="hidden" name="countryId" value={c.id} />
                  <input type="hidden" name="organisationId" value={id} />
                  <select
                    name="riskLevel"
                    defaultValue={c.riskLevel ?? ""}
                    className="rounded-md border border-zinc-300 px-2 py-1 text-sm"
                  >
                    <option value="">Pending review</option>
                    {RISK_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level.charAt(0) + level.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-md bg-zinc-900 px-3 py-1 text-sm font-medium text-white hover:bg-zinc-800"
                  >
                    Save
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-zinc-900">Organisation details</h2>
        <form action={updateOrganisationDetails} className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="id" value={id} />
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Organisation name</label>
            <input
              name="name"
              defaultValue={org.name}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Consultant name</label>
            <input
              name="consultantName"
              defaultValue={org.consultantName ?? ""}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Consultant email</label>
            <input
              name="consultantEmail"
              defaultValue={org.consultantEmail ?? ""}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Internal notes</label>
            <textarea
              name="consultantNotes"
              defaultValue={org.consultantNotes ?? ""}
              rows={3}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Save details
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="text-lg font-semibold text-zinc-900">{value}</div>
      {sub && <div className="text-xs text-zinc-500">{sub}</div>}
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
      {priority}
    </span>
  );
}
