import Link from "next/link";
import { requireOrganisationByToken, getQuestions } from "@/app/lib/data";

export default async function AssessmentOverviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const org = await requireOrganisationByToken(token);
  const questions = await getQuestions();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Welcome, {org.name}</h1>
        <p className="mt-2 text-sm text-zinc-600">
          This tool assesses your organisation&apos;s readiness to manage risk, security,
          and resilience in your operating context. Work through the steps below in order.
          Answer honestly, based on what actually happens today &mdash; not intended
          practice.
        </p>
      </div>

      <ol className="flex flex-col gap-3">
        <StepCard
          href={`/assessment/${token}/step-1`}
          title="Step 1 · Assessment"
          description={`Answer ${questions.length} questions about your current risk, security, and resilience capability.`}
        />
        <StepCard
          href={`/assessment/${token}/step-2`}
          title="Step 2 · Country Risk"
          description="List the countries you operate in. Your Maravi consultant will assess the risk level for each."
        />
        <StepCard
          href={`/assessment/${token}/step-3`}
          title="Step 3 · Activity & Operational Exposure"
          description="Tell us about your activities and the complexity of your operational footprint."
        />
        <StepCard
          href={`/assessment/${token}/dashboard`}
          title="Step 4 · Dashboard"
          description="See your Theoretical and Actual Readiness scores, calculated automatically."
        />
        <StepCard
          href={`/assessment/${token}/results`}
          title="Step 5 · Acting on Your Results"
          description="Review priority areas and what your results mean in practice."
        />
      </ol>
    </div>
  );
}

function StepCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="block rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300"
      >
        <h2 className="font-medium text-zinc-900">{title}</h2>
        <p className="mt-1 text-sm text-zinc-600">{description}</p>
      </Link>
    </li>
  );
}
