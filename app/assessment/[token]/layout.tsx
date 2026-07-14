import Image from "next/image";
import Link from "next/link";
import { requireOrganisationByToken } from "@/app/lib/data";

const STEPS = [
  { href: "", label: "Overview" },
  { href: "step-1", label: "1. Assessment" },
  { href: "step-2", label: "2. Country Risk" },
  { href: "step-3", label: "3. Activity & Exposure" },
  { href: "dashboard", label: "4. Dashboard" },
  { href: "results", label: "5. Results" },
  { href: "guide", label: "Guide" },
];

export default async function AssessmentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const org = await requireOrganisationByToken(token);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 print:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Image src="/maravi-logo.png" alt="Maravi Group" width={140} height={32} />
          <span className="text-sm font-medium text-zinc-600">{org.name}</span>
        </div>
        <nav className="mx-auto mt-4 flex max-w-4xl flex-wrap gap-x-4 gap-y-2 text-sm">
          {STEPS.map((step) => (
            <Link
              key={step.href}
              href={`/assessment/${token}/${step.href}`}
              className="text-zinc-500 hover:text-zinc-900"
            >
              {step.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="flex-1 bg-zinc-50 px-6 py-8 print:bg-white print:p-0">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
}
