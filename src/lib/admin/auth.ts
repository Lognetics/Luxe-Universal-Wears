// Lightweight, GoTrue-independent admin session: a signed, httpOnly cookie.
// The signing secret is the server-only service-role key (already secret).
import "server-only";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "luxe_admin";
const MAX_AGE = 60 * 60 * 12; // 12h

function secret(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.ADMIN_PASSWORD || "insecure-dev-secret";
}

const enc = new TextEncoder();
function b64url(bytes: ArrayBuffer): string {
  return Buffer.from(new Uint8Array(bytes)).toString("base64url");
}
async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return b64url(sig);
}

export async function makeToken(): Promise<string> {
  const payload = `admin.${Date.now()}`;
  return `${payload}.${await sign(payload)}`;
}

export async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const i = token.lastIndexOf(".");
  if (i < 0) return false;
  const payload = token.slice(0, i);
  const sig = token.slice(i + 1);
  if (!payload.startsWith("admin.")) return false;
  const expected = await sign(payload);
  return sig.length === expected.length && sig === expected;
}

/** True when the caller has a valid admin cookie. Use in server actions. */
export async function isAdminRequest(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(ADMIN_COOKIE)?.value);
}

export async function setAdminCookie() {
  const store = await cookies();
  store.set(ADMIN_COOKIE, await makeToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

export function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  return expected.length > 0 && password === expected;
}
