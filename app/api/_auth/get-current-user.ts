import { createClient } from "@/app/api/_supabase/server";
import { hasSupabaseAuthEnv } from "@/app/api/_supabase/env";

export async function getCurrentUser() {
  if (!hasSupabaseAuthEnv()) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error) {
    return null;
  }

  return data?.claims ?? null;
}
