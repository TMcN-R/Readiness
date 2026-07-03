import Link from "next/link";
import { headers } from "next/headers";
import { listOrganisations } from "@/app/lib/data";
import { createOrganisation } from "../actions";

const STATUS_LABEL: Record<string, string> = {
  NOT_STARTED: "Not started",
  IN_PROGRESS: "In progress",
  SUBMITTED: "Submitted",
};

export default async function AdminHomePage() {
  const [organisations, headerList] = await Promise.all([listOrganisations(), headers()]);
  const host = headerList.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const baseUrl = host ? `${protocol}://${host}` : "";

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-lg font-semibold text-zinc-900">Add a client organisation</h1>
        <form action={createOrganisation} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-zinc-700">
              Organisation name
            </label>
            <input
              id="name"
              name="name"
              required
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="consultantName" className="mb-1 block text-sm font-medium text-zinc-700">
              Consultant name
            </label>
            <input
              id="consultantName"
              name="consultantName"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="consultantEmail" className="mb-1 block text-sm font-medium text-zinc-700">
              Consultant email
            </label>
            <input
              id="consultantEmail"
              name="consultantEmail"
              type="email"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Create organisation
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
        <h2 className="border-b border-zinc-200 px-6 py-4 text-lg font-semibold text-zinc-900">
          Client organisations
        </h2>
        {organisations.length === 0 ? (
          <p className="px-6 py-8 text-sm text-zinc-500">No organisations yet.</p>
        ) : (
          <ul className="divide-y divide-zinc-200">
            {organisations.map((org) => (
              <li key={org.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <Link
                    href={`/admin/organisations/${org.id}`}
                    className="font-medium text-zinc-900 hover:underline"
                  >
                    {org.name}
                  </Link>
                  <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
                    <span>{STATUS_LABEL[org.status]}</span>
                    {baseUrl && (
                      <code className="rounded bg-zinc-100 px-1.5 py-0.5">
                        {baseUrl}/assessment/{org.accessToken}
                      </code>
                    )}
                  </div>
                </div>
                <Link
                  href={`/admin/organisations/${org.id}`}
                  className="text-sm text-zinc-500 hover:text-zinc-900"
                >
                  Manage &rarr;
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
