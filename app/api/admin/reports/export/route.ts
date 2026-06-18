import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireAdmin } from "@/app/api/_auth/require-admin";
import { reportQuerySchema } from "@/app/api/_schemas/reports/report.schema";
import { exportApplicationsReportCsv } from "@/app/api/_services/reports/reports.service";
import { searchParamsToObject } from "@/app/api/_utils/http";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const filters = reportQuerySchema.parse(searchParamsToObject(request.nextUrl.searchParams));
    const csv = await exportApplicationsReportCsv(filters);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="applications-report.csv"',
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid report filters" }, { status: 400 });
    }

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
