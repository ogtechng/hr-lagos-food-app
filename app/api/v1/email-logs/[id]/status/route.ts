import { NextRequest } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/app/api/_auth/require-admin";
import { updateEmailLogStatusService } from "@/app/api/_services/emails/email-logs.service";
import { handleApiError, notFound, ok, parseJson } from "@/app/api/_utils/http";

const emailLogIdParamSchema = z.object({
  id: z.string().uuid(),
});

const updateEmailLogStatusSchema = z.object({
  status: z.enum(["pending", "sent", "failed"]),
  error: z.string().trim().optional().nullable(),
});

type RouteContext = {
  params: Promise<unknown>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = emailLogIdParamSchema.parse(await context.params);
    const { status, error } = updateEmailLogStatusSchema.parse(await parseJson(request));
    const emailLog = await updateEmailLogStatusService(id, status, error);
    return emailLog ? ok(emailLog) : notFound("Email log not found");
  } catch (error) {
    return handleApiError(error);
  }
}
