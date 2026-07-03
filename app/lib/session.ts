import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "admin_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

function encodedSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function signAdminToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(encodedSecret());
}

export async function isAdminSessionValid(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, encodedSecret(), { algorithms: ["HS256"] });
    return payload.role === "admin";
  } catch {
    return false;
  }
}
