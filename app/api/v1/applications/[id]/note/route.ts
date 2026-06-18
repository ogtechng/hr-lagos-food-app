import { NextRequest } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/app/api/_auth/require-admin";
import { applicationIdParamSchema } from "@/app/api/_schemas/applications/application.schema";
import { updateApplicationAdminNoteService } from "@/app/api/_services/applications/applications.service";
import { handleApiError, notFound, ok, parseJson } from "@/app/api/_utils/http";

const updateApplicationAdminNoteSchema = z.object({
  adminNote: z.string().trim().optional().nullable(),
});

type RouteContext = {
  params: Promise<unknown>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = applicationIdParamSchema.parse(await context.params);
    const { adminNote } = updateApplicationAdminNoteSchema.parse(await parseJson(request));
    const application = await updateApplicationAdminNoteService(id, adminNote ?? null);
    return application ? ok(application) : notFound("Application not found");
  } catch (error) {
    return handleApiError(error);
  }
}
