import { redirect } from "next/navigation";

import { createClient } from "@/app/api/_supabase/server";
import { assertAdmin } from "@/app/api/_auth/permissions";
import { getCurrentUser } from "@/app/api/_auth/get-current-user";
import { hasSupabaseAuthEnv } from "@/app/api/_supabase/env";
import type { LoginInput } from "@/features/auth/schemas/auth.schema";

export async function loginAdmin(input: LoginInput) {
  if (!hasSupabaseAuthEnv()) {
    return { success: false as const, error: "Admin login is not configured" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(input);

  if (error) {
    return { success: false as const, error: "Invalid email or password" };
  }

  const user = await getCurrentUser();

  try {
    assertAdmin(user);
  } catch {
    await supabase.auth.signOut();
    return { success: false as const, error: "You do not have access to the admin portal" };
  }

  redirect("/admin");
}

export async function logoutAdmin() {
  if (!hasSupabaseAuthEnv()) {
    redirect("/admin/login");
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function redirectIfAdmin() {
  const user = await getCurrentUser();

  try {
    assertAdmin(user);
  } catch {
    return;
  }

  redirect("/admin");
}
