"use server";

import { loginSchema } from "@/features/auth/schemas/auth.schema";
import type { AuthActionState } from "@/features/auth/types/auth.types";
import { loginAdmin, logoutAdmin } from "@/features/auth/services/auth.service";

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Enter a valid email and password",
    };
  }

  return loginAdmin(parsed.data);
}

export async function logoutAction() {
  await logoutAdmin();
}
