import { NextRequest } from "next/server";

import { requireAdmin } from "@/app/api/_auth/require-admin";
import {
  departmentIdParamSchema,
  updateDepartmentSchema,
} from "@/app/api/_schemas/departments/department.schema";
import {
  deleteDepartmentService,
  getDepartmentByIdService,
  updateDepartmentService,
} from "@/app/api/_services/departments/departments.service";
import { handleApiError, noContent, notFound, ok, parseJson } from "@/app/api/_utils/http";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = departmentIdParamSchema.parse(await context.params);
    const department = await getDepartmentByIdService(id);
    return department ? ok(department) : notFound("Department not found");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = departmentIdParamSchema.parse(await context.params);
    const input = updateDepartmentSchema.parse(await parseJson(request));
    const department = await updateDepartmentService(id, input);
    return department ? ok(department) : notFound("Department not found");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = departmentIdParamSchema.parse(await context.params);
    const department = await deleteDepartmentService(id);

    if (!department) return notFound("Department not found");

    return noContent();
  } catch (error) {
    return handleApiError(error);
  }
}
