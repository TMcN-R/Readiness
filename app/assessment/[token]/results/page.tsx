import { requireOrganisationByToken, computeDashboard } from "@/app/lib/data";
import ReadinessReport from "@/app/components/ReadinessReport";
import DownloadPdfButton from "@/app/components/DownloadPdfButton";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const org = await requireOrganisationByToken(token);
  const dashboard = await computeDashboard(org.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end print:hidden">
        <DownloadPdfButton />
      </div>
      <ReadinessReport org={org} dashboard={dashboard} />
    </div>
  );
}
