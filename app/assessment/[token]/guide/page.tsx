export default function GuidePage() {
  return (
    <div className="flex flex-col gap-8 text-sm text-zinc-700">
      <div>
        <h1 className="mb-2 text-xl font-semibold text-zinc-900">Client User Guide</h1>
        <p className="text-zinc-600">
          This guide explains how the CoreStone™ Resilience Assessment works and how to use it.
        </p>
      </div>

      <section>
        <h2 className="mb-2 text-base font-semibold text-zinc-900">1. Purpose of the tool</h2>
        <p>This tool helps you answer two key questions:</p>
        <ul className="mt-2 list-disc pl-5">
          <li>What risk management capability do we have?</li>
          <li>Is that capability sufficient for our operating context?</li>
        </ul>
        <p className="mt-3">It does this by:</p>
        <ul className="mt-2 list-disc pl-5">
          <li>Assessing your internal capability (theoretical readiness)</li>
          <li>
            Adjusting this based on your operating environment, activities, and operational
            complexity, to provide your actual readiness
          </li>
        </ul>
        <p className="mt-3">At the end, the tool provides:</p>
        <ul className="mt-2 list-disc pl-5">
          <li>
            An assessment of your actual readiness, tailored to your operating environment,
            activities, and country context
          </li>
          <li>
            Your strengths and weaknesses across key areas (Governance, Risk, Security, Crisis,
            BCP, People, Operations, Assurance)
          </li>
          <li>
            The distribution of maturity across your organisation across those same areas
          </li>
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-zinc-900">2. How to use the tool</h2>
        <p className="mb-3 text-zinc-600">Follow these steps in order.</p>

        <h3 className="mt-4 font-medium text-zinc-900">Step 1 &ndash; Assessment</h3>
        <p>Answer each question based on current practice across your organisation.</p>
        <p className="mt-2">Select one of the following for each question:</p>
        <ul className="mt-2 list-disc pl-5">
          <li>No / None &mdash; not in place</li>
          <li>Ad hoc / Informal &mdash; informal or inconsistent</li>
          <li>Partial / Infrequent &mdash; some elements in place but gaps remain</li>
          <li>Formal &mdash; defined and generally implemented</li>
          <li>Embedded &mdash; fully integrated and consistently applied</li>
          <li>N/A &mdash; not applicable</li>
        </ul>
        <p className="mt-2">
          Be realistic. Answer based on what actually happens, not intended practice. The tool
          averages all responses and converts the result into a percentage (0&ndash;100%). For
          example, mostly &ldquo;Formal&rdquo; responses will result in a score of approximately
          75%.
        </p>

        <h3 className="mt-4 font-medium text-zinc-900">Step 2 &ndash; Country Risk</h3>
        <p>
          Enter the countries you operate in. Your Maravi consultant will complete the risk
          assessment for each, using Maravi&apos;s proprietary country risk tool. The country
          risk level you operate in affects your overall Actual Readiness score &mdash;
          higher-risk countries require greater capability. Your consultant will explain the
          country risk scores and what they mean for your organisation.
        </p>

        <h3 className="mt-4 font-medium text-zinc-900">
          Step 3 &ndash; Activity and Operational Exposure
        </h3>
        <p>Complete the following:</p>
        <ul className="mt-2 list-disc pl-5">
          <li>
            <strong>High-risk activity:</strong> select Yes if your organisation undertakes
            higher-risk activities (e.g. enforcement, investigations, high-threat
            environments). Otherwise select No.
          </li>
          <li>
            <strong>Operational footprint:</strong> select single site, multiple sites (same
            country), or multi-country / remote operations.
          </li>
        </ul>

        <h3 className="mt-4 font-medium text-zinc-900">Step 4 &ndash; Dashboard</h3>
        <p>This summarises your results and provides an overall interpretation, including:</p>
        <ul className="mt-2 list-disc pl-5">
          <li>
            <strong>Theoretical Readiness Score</strong> &mdash; expressed as a percentage,
            which determines your capability level: below 30% Critical, 30&ndash;50% Fragile,
            50&ndash;70% Developing, 70&ndash;85% Operational, above 85% Mature.
          </li>
          <li>
            <strong>Actual Readiness</strong> &mdash; your capability in context.
          </li>
          <li>Summary description, charts, and tables.</li>
        </ul>

        <h3 className="mt-4 font-medium text-zinc-900">Step 5 &ndash; Acting on Your Results</h3>
        <p>
          Review the identified priority areas and consider where strengthening capability will
          have the greatest impact. Focus on areas where systems are less developed or not
          consistently applied. The results should be used to support discussion,
          prioritisation, and planning of improvements.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-zinc-900">3. How scoring works</h2>
        <p>
          Theoretical Readiness shows what capability you have, suitable for a single-country,
          low-risk activity in a low-risk country. Actual Readiness shows whether that
          capability is sufficient for your level of exposure to risk. Your exposure to risk
          increases with high-risk activities, multi-country operations, and operating in
          high-risk countries. Based on your answers in Steps 1, 2 and 3, we calculate your
          Actual Readiness. If the adjusted score is significantly lower than the theoretical
          score, your Maravi consultant will advise on what that means and how to respond.
        </p>

        <h3 className="mt-4 font-medium text-zinc-900">How adjustments work</h3>
        <p>
          Your Theoretical Readiness is adjusted based on the nature of your activities, the
          complexity of your operations, and the risk level of the countries you work in.
          Together these reflect the level of capability your organisation actually needs given
          its operating context.
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>
            <strong>High-risk activity:</strong> organisations undertaking high-risk activities
            (such as work in high-threat environments, enforcement, or investigations) require a
            significantly higher level of capability.
          </li>
          <li>
            <strong>Operational complexity:</strong> the broader and more distributed your
            operations, the greater the capability required to manage them safely and
            effectively. Single site: no adjustment. Multiple sites (same country): modest
            adjustment. Multi-country or remote operations: greater adjustment.
          </li>
          <li>
            <strong>Country risk:</strong> operating in higher-risk countries increases the level
            of capability required. Your consultant assesses each country using Maravi&apos;s
            country risk tool; the highest-risk country you operate in contributes to your
            overall Actual Readiness score.
          </li>
        </ul>

        <h3 className="mt-4 font-medium text-zinc-900">What this means</h3>
        <p>
          If the adjustment results in your score dropping, this does not mean your organisation
          is weaker &mdash; it reflects that your operating environment and activities may
          require a higher level of readiness. Your consultant will advise what this means in
          practice: for example a policy gap, an implementation gap, or a staffing gap.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-zinc-900">4. Important notes</h2>
        <ul className="list-disc pl-5">
          <li>This tool will give you insight into: are we good enough for what we are doing?</li>
          <li>Be honest in your responses. The tool is designed to reflect reality.</li>
          <li>
            High-risk activities and complex operations increase what is required to operate
            safely.
          </li>
          <li>
            This is not a compliance tool. It is designed to support reflection and
            decision-making.
          </li>
          <li>
            The results should be used to identify areas for improvement and start discussion.
          </li>
        </ul>
      </section>
    </div>
  );
}
