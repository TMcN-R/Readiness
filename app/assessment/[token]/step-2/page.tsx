import Link from "next/link";
import { requireOrganisationByToken, getCountries } from "@/app/lib/data";
import { addCountry, removeCountry } from "./actions";

const RISK_LABEL: Record<string, string> = {
  LOW: "Low",
  MODERATE: "Moderate",
  ELEVATED: "Elevated",
  SEVERE: "Severe",
};

export default async function Step2Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const org = await requireOrganisationByToken(token);
  const countries = await getCountries(org.id);

  const addCountryWithToken = addCountry.bind(null, token);
  const removeCountryWithToken = removeCountry.bind(null, token);

  return (
    <div>
      <h1 className="mb-2 text-xl font-semibold text-zinc-900">Step 2: Country Risk</h1>
      <p className="mb-6 text-sm text-zinc-600">
        Enter the countries you operate in, one at a time. Your Maravi consultant will assess
        the risk level for each using Maravi&apos;s proprietary country risk methodology &mdash;
        this affects your overall Actual Readiness score.
      </p>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <form action={addCountryWithToken} className="mb-6 flex gap-2">
          <input
            name="name"
            required
            placeholder="Country name"
            className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Add country
          </button>
        </form>

        {countries.length === 0 ? (
          <p className="text-sm text-zinc-500">No countries added yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {countries.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-md border border-zinc-100 px-4 py-2"
              >
                <span className="text-sm font-medium text-zinc-800">{c.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500">
                    {c.riskLevel ? RISK_LABEL[c.riskLevel] : "Pending consultant review"}
                  </span>
                  <form action={removeCountryWithToken}>
                    <input type="hidden" name="countryId" value={c.id} />
                    <button type="submit" className="text-xs text-red-600 hover:underline">
                      Remove
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8">
        <Link
          href={`/assessment/${token}/step-3`}
          className="inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Continue to Step 3 &rarr;
        </Link>
      </div>
    </div>
  );
}
