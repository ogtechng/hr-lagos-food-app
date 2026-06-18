import { NextRequest } from "next/server";

import { requireAdmin } from "@/app/api/_auth/require-admin";
import { jobIdParamSchema } from "@/app/api/_schemas/jobs/job.schema";
import { publishJobService } from "@/app/api/_services/jobs/jobs.service";
import { handleApiError, notFound, ok } from "@/app/api/_utils/http";

type RouteContext = {
  params: Promise<unknown>;
};

export async function PATCH(_: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = jobIdParamSchema.parse(await context.params);
    const job = await publishJobService(id);
    return job ? ok(job) : notFound("Job not found");
  } catch (error) {
    return handleApiError(error);
  }
}
