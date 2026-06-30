import { requireAdmin } from "@/app/api/_auth/require-admin";
import { listActiveDepartmentsService } from "@/app/api/_services/departments/departments.service";
import { handleApiError, ok } from "@/app/api/_utils/http";

export async function GET() {
  try {
    await requireAdmin();
    return ok(await listActiveDepartmentsService());
  } catch (error) {
    return handleApiError(error);
  }
}
