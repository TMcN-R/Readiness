"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { getOrganisationByToken } from "@/app/lib/data";
import type { OperationalFootprint } from "@/app/generated/prisma/client";

export async function saveActivityExposure(token: string, formData: FormData) {
  const org = await getOrganisationByToken(token);
  if (!org) return;

  const highRiskActivity = formData.get("highRiskActivity") === "yes";
  const operationalFootprint = String(
    formData.get("operationalFootprint") ?? "SINGLE_SITE"
  ) as OperationalFootprint;

  await prisma.activityExposure.upsert({
    where: { organisationId: org.id },
    update: { highRiskActivity, operationalFootprint },
    create: { organisationId: org.id, highRiskActivity, operationalFootprint },
  });

  if (org.status !== "SUBMITTED") {
    await prisma.organisation.update({
      where: { id: org.id },
      data: { status: "SUBMITTED" },
    });
  }

  redirect(`/assessment/${token}/dashboard`);
}
