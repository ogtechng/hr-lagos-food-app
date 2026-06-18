import { assertAdmin } from "@/app/api/_auth/permissions";
import { getCurrentUser } from "@/app/api/_auth/get-current-user";

export async function requireAdmin() {
  return assertAdmin(await getCurrentUser());
}
