"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { generateAccessToken } from "@/app/lib/token";
import { destroyAdminSession } from "@/app/lib/auth";

export async function logout() {
  await destroyAdminSession();
  redirect("/admin/login");
}

export async function createOrganisation(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const consultantName = String(formData.get("consultantName") ?? "").trim() || null;
  const consultantEmail = String(formData.get("consultantEmail") ?? "").trim() || null;

  await prisma.organisation.create({
    data: {
      name,
      consultantName,
      consultantEmail,
      accessToken: generateAccessToken(),
    },
  });

  revalidatePath("/admin");
}
