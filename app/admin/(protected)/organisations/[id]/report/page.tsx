import { notFound } from "next/navigation";
import { getOrganisationById, computeDashboard } from "@/app/lib/data";
import ReadinessReport from "@/app/components/ReadinessReport";
import DownloadPdfButton from "@/app/components/DownloadPdfButton";

export default async function OrganisationReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const org = await getOrganisationById(id);
  if (!org) notFound();

  const dashboard = await computeDashboard(id);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="flex justify-end print:hidden">
        <DownloadPdfButton />
      </div>
      <ReadinessReport org={org} dashboard={dashboard} />
    </div>
  );
}
