import { NextRequest } from "next/server";

import { requireAdmin } from "@/app/api/_auth/require-admin";
import { reportFiltersSchema } from "@/app/api/_schemas/reports/report.schema";
import { getApplicationsReportSummaryService } from "@/app/api/_services/reports/reports.service";
import { handleApiError, ok, searchParamsToObject } from "@/app/api/_utils/http";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const filters = reportFiltersSchema.parse(searchParamsToObject(request.nextUrl.searchParams));
    return ok(await getApplicationsReportSummaryService(filters));
  } catch (error) {
    return handleApiError(error);
  }
}
