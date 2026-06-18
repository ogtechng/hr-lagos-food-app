import { NextRequest } from "next/server";

import { jobSlugParamSchema } from "@/app/api/_schemas/jobs/job.schema";
import { getPublishedJobBySlugService } from "@/app/api/_services/jobs/jobs.service";
import { handleApiError, notFound, ok } from "@/app/api/_utils/http";

type RouteContext = {
  params: Promise<unknown>;
};

export async function GET(_: NextRequest, context: RouteContext) {
  try {
    const { slug } = jobSlugParamSchema.parse(await context.params);
    const job = await getPublishedJobBySlugService(slug);
    return job ? ok(job) : notFound("Job not found");
  } catch (error) {
    return handleApiError(error);
  }
}
