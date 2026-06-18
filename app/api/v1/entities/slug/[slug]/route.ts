import { NextRequest } from "next/server";

import { entitySlugParamSchema } from "@/app/api/_schemas/entities/entity.schema";
import { getEntityBySlugService } from "@/app/api/_services/entities/entities.service";
import { handleApiError, notFound, ok } from "@/app/api/_utils/http";

type RouteContext = {
  params: Promise<unknown>;
};

export async function GET(_: NextRequest, context: RouteContext) {
  try {
    const { slug } = entitySlugParamSchema.parse(await context.params);
    const entity = await getEntityBySlugService(slug);
    return entity ? ok(entity) : notFound("Entity not found");
  } catch (error) {
    return handleApiError(error);
  }
}
