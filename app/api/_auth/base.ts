import { createClient } from "@/app/api/_supabase/server";
import { requireAdmin } from "@/app/api/_auth/require-admin";
import { hasSupabaseAuthEnv } from "@/app/api/_supabase/env";

export async function getClaims() {
  if (!hasSupabaseAuthEnv()) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  return error ? null : (data?.claims ?? null);
}

export async function requireAuth() {
  const claims = await getClaims();
  if (!claims) {
    throw new Error("Unauthorized");
  }
  return claims;
}

export { requireAdmin };
