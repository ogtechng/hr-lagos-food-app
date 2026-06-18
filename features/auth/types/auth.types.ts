import type { JwtPayload } from "@supabase/supabase-js";

export type CurrentUser = JwtPayload & {
  email: string;
};

export type AdminUser = CurrentUser;

export type AuthActionState = {
  success: boolean;
  error?: string;
};
