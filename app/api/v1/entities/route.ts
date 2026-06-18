import { NextRequest } from "next/server";

import { requireAdmin } from "@/app/api/_auth/require-admin";
import { created, handleApiError, ok, parseJson } from "@/app/api/_utils/http";
import { createEntitySchema } from "@/app/api/_schemas/entities/entity.schema";
import {
  createEntityService,
  listEntitiesService,
} from "@/app/api/_services/entities/entities.service";

export async function GET() {
  try {
    await requireAdmin();
    return ok(await listEntitiesService());
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const input = createEntitySchema.parse(await parseJson(request));
    return created(await createEntityService(input));
  } catch (error) {
    return handleApiError(error);
  }
}
