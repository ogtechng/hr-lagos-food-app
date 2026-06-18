import { listActiveEntitiesService } from "@/app/api/_services/entities/entities.service";
import { handleApiError, ok } from "@/app/api/_utils/http";

export async function GET() {
  try {
    return ok(await listActiveEntitiesService());
  } catch (error) {
    return handleApiError(error);
  }
}
