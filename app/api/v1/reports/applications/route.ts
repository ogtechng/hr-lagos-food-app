import { NextRequest } from "next/server";

import { requireAdmin } from "@/app/api/_auth/require-admin";
import {
  reportFiltersSchema,
  reportListQuerySchema,
} from "@/app/api/_schemas/reports/report.schema";
import {
  getApplicationsReportPaginatedService,
  getApplicationsReportService,
} from "@/app/api/_services/reports/reports.service";
import { handleApiError, ok, searchParamsToObject } from "@/app/api/_utils/http";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const raw = searchParamsToObject(request.nextUrl.searchParams);

    if (raw.page || raw.pageSize || raw.sortBy || raw.sortDir) {
      const query = reportListQuerySchema.parse(raw);
      return ok(await getApplicationsReportPaginatedService(query));
    }

    const filters = reportFiltersSchema.parse(raw);
    return ok(await getApplicationsReportService(filters));
  } catch (error) {
    return handleApiError(error);
  }
}
