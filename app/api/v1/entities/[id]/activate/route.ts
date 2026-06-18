import { NextRequest } from "next/server";

import { requireAdmin } from "@/app/api/_auth/require-admin";
import { entityIdParamSchema } from "@/app/api/_schemas/entities/entity.schema";
import { activateEntityService } from "@/app/api/_services/entities/entities.service";
import { handleApiError, notFound, ok } from "@/app/api/_utils/http";

type RouteContext = {
  params: Promise<unknown>;
};

export async function PATCH(_: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = entityIdParamSchema.parse(await context.params);
    const entity = await activateEntityService(id);
    return entity ? ok(entity) : notFound("Entity not found");
  } catch (error) {
    return handleApiError(error);
  }
}
