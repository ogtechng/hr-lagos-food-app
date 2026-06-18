import type { JwtPayload } from "@supabase/supabase-js";

export type AuthClaims = JwtPayload | null;

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminUser(claims: AuthClaims) {
  if (!claims?.email) {
    return false;
  }

  const appRole = claims.app_metadata?.role;
  const userRole = claims.user_metadata?.role;

  if (appRole === "admin" || userRole === "admin") {
    return true;
  }

  return getAdminEmails().includes(claims.email.toLowerCase());
}

export function assertAdmin(claims: AuthClaims) {
  if (!claims) {
    throw new Error("Unauthorized");
  }

  if (!isAdminUser(claims)) {
    throw new Error("Forbidden");
  }

  return claims;
}
