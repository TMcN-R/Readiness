import { requireOrganisationByToken, getActivityExposure } from "@/app/lib/data";
import { saveActivityExposure } from "./actions";

export default async function Step3Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const org = await requireOrganisationByToken(token);
  const activity = await getActivityExposure(org.id);

  const saveWithToken = saveActivityExposure.bind(null, token);

  return (
    <div>
      <h1 className="mb-2 text-xl font-semibold text-zinc-900">
        Step 3: Activity &amp; Operational Exposure
      </h1>
      <p className="mb-6 text-sm text-zinc-600">
        Select your answers below. These reflect the nature of your activities and the
        complexity of your operations, which increase the level of capability required to
        operate safely.
      </p>

      <form action={saveWithToken} className="flex flex-col gap-6">
        <fieldset className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <legend className="px-1 text-sm font-medium text-zinc-900">
            Does your organisation undertake high-risk activities?
          </legend>
          <p className="mb-4 mt-1 text-sm text-zinc-500">
            High-risk activities include work in high-threat environments, enforcement or
            investigation activities, or operations where staff are exposed to significant
            security, safety, travel or reputational risks.
          </p>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-zinc-800">
              <input
                type="radio"
                name="highRiskActivity"
                value="yes"
                defaultChecked={activity?.highRiskActivity === true}
                required
              />
              Yes
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-800">
              <input
                type="radio"
                name="highRiskActivity"
                value="no"
                defaultChecked={activity?.highRiskActivity === false}
              />
              No
            </label>
          </div>
        </fieldset>

        <fieldset className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <legend className="px-1 text-sm font-medium text-zinc-900">
            How complex is your operational footprint?
          </legend>
          <p className="mb-4 mt-1 text-sm text-zinc-500">
            This reflects how widely and complexly your operations are delivered.
          </p>
          <div className="flex flex-col gap-3">
            <label className="flex items-start gap-2 text-sm text-zinc-800">
              <input
                type="radio"
                name="operationalFootprint"
                value="SINGLE_SITE"
                defaultChecked={activity?.operationalFootprint === "SINGLE_SITE"}
                required
                className="mt-0.5"
              />
              <span>
                <strong>Single site</strong> &mdash; one primary operational location
              </span>
            </label>
            <label className="flex items-start gap-2 text-sm text-zinc-800">
              <input
                type="radio"
                name="operationalFootprint"
                value="MULTIPLE_SITES"
                defaultChecked={activity?.operationalFootprint === "MULTIPLE_SITES"}
                className="mt-0.5"
              />
              <span>
                <strong>Multiple sites (same country)</strong> &mdash; several locations
                within one country
              </span>
            </label>
            <label className="flex items-start gap-2 text-sm text-zinc-800">
              <input
                type="radio"
                name="operationalFootprint"
                value="MULTI_COUNTRY"
                defaultChecked={activity?.operationalFootprint === "MULTI_COUNTRY"}
                className="mt-0.5"
              />
              <span>
                <strong>Multi-country / remote operations</strong> &mdash; activities across
                multiple countries or remotely managed teams
              </span>
            </label>
          </div>
        </fieldset>

        <button
          type="submit"
          className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Save and view dashboard &rarr;
        </button>
      </form>
    </div>
  );
}
