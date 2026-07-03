import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { SESSION_COOKIE, SESSION_DURATION_SECONDS, signAdminToken, isAdminSessionValid } from "./session";

export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedUsername || !expectedHash) return false;
  if (username !== expectedUsername) return false;
  return bcrypt.compare(password, expectedHash);
}

export async function createAdminSession(): Promise<void> {
  const token = await signAdminToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function requireAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!(await isAdminSessionValid(token))) {
    redirect("/admin/login");
  }
}
