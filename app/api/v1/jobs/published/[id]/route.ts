import { NextRequest } from "next/server";

import { jobIdParamSchema } from "@/app/api/_schemas/jobs/job.schema";
import { getPublishedJobByIdService } from "@/app/api/_services/jobs/jobs.service";
import { handleApiError, notFound, ok } from "@/app/api/_utils/http";

type RouteContext = {
  params: Promise<unknown>;
};

export async function GET(_: NextRequest, context: RouteContext) {
  try {
    const { id } = jobIdParamSchema.parse(await context.params);
    const job = await getPublishedJobByIdService(id);
    return job ? ok(job) : notFound("Job not found");
  } catch (error) {
    return handleApiError(error);
  }
}
