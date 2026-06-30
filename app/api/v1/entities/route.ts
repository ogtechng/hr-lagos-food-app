import { NextRequest } from "next/server";

import { requireAdmin } from "@/app/api/_auth/require-admin";
import { created, handleApiError, ok, parseJson, searchParamsToObject } from "@/app/api/_utils/http";
import { createEntitySchema, entityListQuerySchema } from "@/app/api/_schemas/entities/entity.schema";
import {
  createEntityService,
  listEntitiesPaginatedService,
  listEntitiesService,
} from "@/app/api/_services/entities/entities.service";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const raw = searchParamsToObject(request.nextUrl.searchParams);

    if (raw.page || raw.pageSize || raw.sortBy || raw.sortDir || raw.search || raw.status) {
      const query = entityListQuerySchema.parse(raw);
      return ok(await listEntitiesPaginatedService(query));
    }

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
