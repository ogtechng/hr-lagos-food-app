import { NextRequest } from "next/server";

import { requireAdmin } from "@/app/api/_auth/require-admin";
import { entityIdParamSchema, updateEntitySchema } from "@/app/api/_schemas/entities/entity.schema";
import {
  deleteEntityService,
  getEntityByIdService,
  updateEntityService,
} from "@/app/api/_services/entities/entities.service";
import {
  conflict,
  handleApiError,
  noContent,
  notFound,
  ok,
  parseJson,
} from "@/app/api/_utils/http";

type RouteContext = {
  params: Promise<unknown>;
};

export async function GET(_: NextRequest, context: RouteContext) {
  try {
    const { id } = entityIdParamSchema.parse(await context.params);
    const entity = await getEntityByIdService(id);
    return entity ? ok(entity) : notFound("Entity not found");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = entityIdParamSchema.parse(await context.params);
    const input = updateEntitySchema.parse(await parseJson(request));
    const entity = await updateEntityService(id, input);
    return entity ? ok(entity) : notFound("Entity not found");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = entityIdParamSchema.parse(await context.params);
    const entity = await deleteEntityService(id);
    return entity ? noContent() : notFound("Entity not found");
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "23503") {
      return conflict("Entity cannot be deleted while jobs are linked");
    }

    return handleApiError(error);
  }
}
