import "server-only";
import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Very simple admin login: one password, stored in .env.local as ADMIN_PASSWORD.
 * Good enough for a small team at the start. Later, switch to Supabase Auth
 * with a separate account for each team member.
 */

const COOKIE = "hs_admin";

function expectedToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return createHash("sha256").update(`haqsaathi-admin:${pw}`).digest("hex");
}

function same(a: string, b: string) {
  return a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export const isAdminPasswordSet = () => Boolean(process.env.ADMIN_PASSWORD);

export function passwordIsCorrect(pw: string): boolean {
  const real = process.env.ADMIN_PASSWORD;
  return Boolean(real) && same(pw, real!);
}

export async function isAdmin(): Promise<boolean> {
  const token = expectedToken();
  const value = (await cookies()).get(COOKIE)?.value;
  return Boolean(token && value && same(value, token));
}

/** Use at the top of every admin page and action. Sends visitors to the login page. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function startAdminSession() {
  (await cookies()).set(COOKIE, expectedToken()!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function endAdminSession() {
  (await cookies()).delete(COOKIE);
}
