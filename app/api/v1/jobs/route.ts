import { NextRequest } from "next/server";

import { requireAdmin } from "@/app/api/_auth/require-admin";
import { createJobSchema, jobFiltersSchema } from "@/app/api/_schemas/jobs/job.schema";
import { createJobService, listJobsService } from "@/app/api/_services/jobs/jobs.service";
import {
  created,
  handleApiError,
  ok,
  parseJson,
  searchParamsToObject,
} from "@/app/api/_utils/http";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const filters = jobFiltersSchema.parse(searchParamsToObject(request.nextUrl.searchParams));
    return ok(await listJobsService(filters));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const input = createJobSchema.parse(await parseJson(request));
    return created(await createJobService(input));
  } catch (error) {
    return handleApiError(error);
  }
}
