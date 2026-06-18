import { NextRequest } from "next/server";

import { jobFiltersSchema } from "@/app/api/_schemas/jobs/job.schema";
import { listPublishedJobsService } from "@/app/api/_services/jobs/jobs.service";
import { handleApiError, ok, searchParamsToObject } from "@/app/api/_utils/http";

export async function GET(request: NextRequest) {
  try {
    const filters = jobFiltersSchema
      .omit({ status: true })
      .parse(searchParamsToObject(request.nextUrl.searchParams));
    return ok(await listPublishedJobsService(filters));
  } catch (error) {
    return handleApiError(error);
  }
}
