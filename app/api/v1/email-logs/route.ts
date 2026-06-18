import { NextRequest } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/app/api/_auth/require-admin";
import { createEmailLogService } from "@/app/api/_services/emails/email-logs.service";
import { created, handleApiError, parseJson } from "@/app/api/_utils/http";

const createEmailLogSchema = z.object({
  recipient: z.string().trim().email().max(255),
  subject: z.string().trim().min(1).max(255),
  template: z.string().trim().min(1).max(120),
  status: z.enum(["pending", "sent", "failed"]).optional(),
  error: z.string().trim().optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const input = createEmailLogSchema.parse(await parseJson(request));
    return created(await createEmailLogService(input));
  } catch (error) {
    return handleApiError(error);
  }
}
