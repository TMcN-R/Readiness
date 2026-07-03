"use server";

import { redirect } from "next/navigation";
import { verifyAdminCredentials, createAdminSession } from "@/app/lib/auth";

export async function login(formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  const valid = await verifyAdminCredentials(username, password);
  if (!valid) {
    redirect("/admin/login?error=1");
  }

  await createAdminSession();
  redirect("/admin");
}
