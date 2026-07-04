"use client";

import { useState } from "react";
import type { Answer, Section } from "@/app/lib/scoring";

type Question = {
  id: string;
  section: Section;
  order: number;
  text: string;
};

const ANSWER_OPTIONS: { value: Answer; label: string; definition: string }[] = [
  {
    value: "NONE",
    label: "No / None",
    definition:
      "Not defined and not implemented. No clear structure, process, or approach is in place.",
  },
  {
    value: "AD_HOC",
    label: "Ad hoc / Informal",
    definition:
      "Not formally defined, but some informal or inconsistent practice exists. Activities may happen but are unplanned or unreliable.",
  },
  {
    value: "PARTIAL",
    label: "Partial / Infrequent",
    definition:
      "Some elements exist but are incomplete, inconsistently applied, or gaps remain in practice.",
  },
  {
    value: "FORMAL",
    label: "Formal",
    definition:
      "Formally defined and consistently implemented across most of the organisation. Processes are clearly documented and communicated.",
  },
  {
    value: "EMBEDDED",
    label: "Embedded",
    definition:
      "Fully integrated and consistently applied across the organisation. Routinely used in decision-making and continuously improved.",
  },
  {
    value: "NA",
    label: "N/A",
    definition:
      "Not applicable. Use only where a question genuinely does not apply — not as a substitute for No / None.",
  },
];

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

type SaveState = "idle" | "saving" | "saved" | "error";

export default function AssessmentForm({
  token,
  sections,
  initialAnswers,
}: {
  token: string;
  sections: { section: Section; questions: Question[] }[];
  initialAnswers: Record<string, Answer>;
}) {
  const [answers, setAnswers] = useState<Record<string, Answer>>(initialAnswers);
  const [saveStates, setSaveStates] = useState<Record<string, SaveState>>({});

  const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);
  const answeredCount = Object.keys(answers).length;

  async function handleAnswer(questionId: string, answer: Answer) {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    setSaveStates((prev) => ({ ...prev, [questionId]: "saving" }));

    try {
      const res = await fetch(`/api/assessment/${token}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, answer }),
      });
      setSaveStates((prev) => ({ ...prev, [questionId]: res.ok ? "saved" : "error" }));
    } catch {
      setSaveStates((prev) => ({ ...prev, [questionId]: "error" }));
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="sticky top-0 z-10 -mx-6 border-b border-zinc-200 bg-zinc-50/95 px-6 py-2 text-sm text-zinc-600 backdrop-blur">
        {answeredCount} of {totalQuestions} answered
      </div>

      <details className="rounded-md border border-zinc-200 bg-white p-4">
        <summary className="cursor-pointer text-sm font-medium text-zinc-800">
          What do these responses mean?
        </summary>
        <dl className="mt-3 flex flex-col gap-2">
          {ANSWER_OPTIONS.map((opt) => (
            <div key={opt.value}>
              <dt className="text-sm font-medium text-zinc-900">{opt.label}</dt>
              <dd className="text-sm text-zinc-600">{opt.definition}</dd>
            </div>
          ))}
        </dl>
      </details>

      {sections.map(({ section, questions }) => (
        <section key={section}>
          <h2 className="mb-3 text-base font-semibold text-zinc-900">
            {SECTION_LABEL[section]}
          </h2>
          <div className="flex flex-col gap-3">
            {questions.map((q) => (
              <div
                key={q.id}
                className="flex flex-col gap-2 rounded-md border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <p className="text-sm text-zinc-800">{q.text}</p>
                <div className="flex shrink-0 items-center gap-2">
                  <select
                    value={answers[q.id] ?? ""}
                    onChange={(e) => handleAnswer(q.id, e.target.value as Answer)}
                    className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm focus:border-zinc-500 focus:outline-none"
                  >
                    <option value="" disabled>
                      Select&hellip;
                    </option>
                    {ANSWER_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <SaveIndicator state={saveStates[q.id]} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function SaveIndicator({ state }: { state?: SaveState }) {
  if (state === "saving") return <span className="w-12 text-xs text-zinc-400">Saving&hellip;</span>;
  if (state === "saved") return <span className="w-12 text-xs text-emerald-600">Saved</span>;
  if (state === "error") return <span className="w-12 text-xs text-red-600">Error</span>;
  return <span className="w-12 text-xs text-transparent">&nbsp;</span>;
}
