"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

export async function deleteOrganisation(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  // Responses, Countries, and ActivityExposure all cascade-delete with the
  // organisation (see onDelete: Cascade in schema.prisma).
  await prisma.organisation.delete({ where: { id } });

  revalidatePath("/admin");
  redirect("/admin");
}
