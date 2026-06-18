import { NextRequest } from "next/server";

import { requireAdmin } from "@/app/api/_auth/require-admin";
import { jobIdParamSchema, updateJobSchema } from "@/app/api/_schemas/jobs/job.schema";
import { getJobByIdService, updateJobService } from "@/app/api/_services/jobs/jobs.service";
import { handleApiError, notFound, ok, parseJson } from "@/app/api/_utils/http";

type RouteContext = {
  params: Promise<unknown>;
};

export async function GET(_: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = jobIdParamSchema.parse(await context.params);
    const job = await getJobByIdService(id);
    return job ? ok(job) : notFound("Job not found");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = jobIdParamSchema.parse(await context.params);
    const input = updateJobSchema.parse(await parseJson(request));
    const job = await updateJobService(id, input);
    return job ? ok(job) : notFound("Job not found");
  } catch (error) {
    return handleApiError(error);
  }
}
