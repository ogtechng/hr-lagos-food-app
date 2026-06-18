import { NextRequest } from "next/server";

import { requireAdmin } from "@/app/api/_auth/require-admin";
import { applicationIdParamSchema } from "@/app/api/_schemas/applications/application.schema";
import { listApplicationStatusEventsService } from "@/app/api/_services/applications/applications.service";
import { handleApiError, ok } from "@/app/api/_utils/http";

type RouteContext = {
  params: Promise<unknown>;
};

export async function GET(_: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = applicationIdParamSchema.parse(await context.params);
    return ok(await listApplicationStatusEventsService(id));
  } catch (error) {
    return handleApiError(error);
  }
}
