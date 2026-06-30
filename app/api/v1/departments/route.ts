import { NextRequest } from "next/server";

import { requireAdmin } from "@/app/api/_auth/require-admin";
import {
  createDepartmentSchema,
  departmentListQuerySchema,
} from "@/app/api/_schemas/departments/department.schema";
import {
  createDepartmentService,
  listDepartmentsPaginatedService,
  listDepartmentsService,
} from "@/app/api/_services/departments/departments.service";
import { created, handleApiError, ok, parseJson, searchParamsToObject } from "@/app/api/_utils/http";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const raw = searchParamsToObject(request.nextUrl.searchParams);

    if (!raw.page && !raw.pageSize && !raw.sortBy && !raw.search && !raw.status) {
      return ok(await listDepartmentsService());
    }

    const query = departmentListQuerySchema.parse(raw);
    return ok(await listDepartmentsPaginatedService(query));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const input = createDepartmentSchema.parse(await parseJson(request));
    return created(await createDepartmentService(input));
  } catch (error) {
    return handleApiError(error);
  }
}
