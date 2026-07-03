import Link from "next/link";
import {
  requireOrganisationByToken,
  getQuestions,
  getResponses,
  groupQuestionsBySection,
} from "@/app/lib/data";
import AssessmentForm from "./AssessmentForm";

export default async function Step1Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const org = await requireOrganisationByToken(token);
  const [questions, responses] = await Promise.all([getQuestions(), getResponses(org.id)]);
  const grouped = groupQuestionsBySection(questions);
  const initialAnswers = Object.fromEntries(responses.map((r) => [r.questionId, r.answer]));

  return (
    <div>
      <h1 className="mb-2 text-xl font-semibold text-zinc-900">Step 1: Assessment</h1>
      <p className="mb-6 text-sm text-zinc-600">
        Select one response per question. Answer based on what actually happens across your
        organisation today &mdash; not intended practice.
      </p>
      <AssessmentForm token={token} sections={grouped} initialAnswers={initialAnswers} />
      <div className="mt-8">
        <Link
          href={`/assessment/${token}/step-2`}
          className="inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Continue to Step 2 &rarr;
        </Link>
      </div>
    </div>
  );
}
