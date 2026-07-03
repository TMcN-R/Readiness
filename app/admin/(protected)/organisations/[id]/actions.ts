"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import type { RiskLevel } from "@/app/generated/prisma/client";

export async function setCountryRisk(formData: FormData) {
  const countryId = String(formData.get("countryId") ?? "");
  const organisationId = String(formData.get("organisationId") ?? "");
  const riskLevelRaw = String(formData.get("riskLevel") ?? "");
  const riskLevel = (riskLevelRaw || null) as RiskLevel | null;

  if (!countryId) return;

  await prisma.country.update({
    where: { id: countryId },
    data: { riskLevel },
  });

  revalidatePath(`/admin/organisations/${organisationId}`);
}

export async function updateOrganisationDetails(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const name = String(formData.get("name") ?? "").trim();
  const consultantName = String(formData.get("consultantName") ?? "").trim() || null;
  const consultantEmail = String(formData.get("consultantEmail") ?? "").trim() || null;
  const consultantNotes = String(formData.get("consultantNotes") ?? "").trim() || null;

  await prisma.organisation.update({
    where: { id },
    data: { name, consultantName, consultantEmail, consultantNotes },
  });

  revalidatePath(`/admin/organisations/${id}`);
}
