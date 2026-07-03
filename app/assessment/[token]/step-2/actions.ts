"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { getOrganisationByToken } from "@/app/lib/data";

export async function addCountry(token: string, formData: FormData) {
  const org = await getOrganisationByToken(token);
  if (!org) return;

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  await prisma.country.create({ data: { organisationId: org.id, name } });
  revalidatePath(`/assessment/${token}/step-2`);
}

export async function removeCountry(token: string, formData: FormData) {
  const org = await getOrganisationByToken(token);
  if (!org) return;

  const countryId = String(formData.get("countryId") ?? "");
  if (!countryId) return;

  await prisma.country.deleteMany({ where: { id: countryId, organisationId: org.id } });
  revalidatePath(`/assessment/${token}/step-2`);
}
