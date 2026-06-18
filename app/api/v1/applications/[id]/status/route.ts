import { NextRequest } from "next/server";

import { requireAdmin } from "@/app/api/_auth/require-admin";
import {
  applicationIdParamSchema,
  updateApplicationStatusSchema,
} from "@/app/api/_schemas/applications/application.schema";
import { updateApplicationStatusService } from "@/app/api/_services/applications/applications.service";
import { handleApiError, notFound, ok, parseJson } from "@/app/api/_utils/http";

type RouteContext = {
  params: Promise<unknown>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = applicationIdParamSchema.parse(await context.params);
    const input = updateApplicationStatusSchema.parse(await parseJson(request));
    const application = await updateApplicationStatusService(id, input);
    return application ? ok(application) : notFound("Application not found");
  } catch (error) {
    return handleApiError(error);
  }
}
