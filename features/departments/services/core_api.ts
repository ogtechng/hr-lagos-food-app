import type { AxiosInstance } from "axios";

import type { DepartmentListQuery } from "@/app/api/_schemas/departments/department.schema";
import type { PaginatedResult } from "@/app/api/_schemas/shared/list-query.schema";
import type { AdminDepartment } from "@/features/departments/types/department.types";

type ApiEnvelope<T> = { data: T };

const core_api = (api: AxiosInstance) => ({
  get_all: async () => (await api.get<ApiEnvelope<AdminDepartment[]>>("/departments")).data.data,
  get_active: async () =>
    (await api.get<ApiEnvelope<AdminDepartment[]>>("/departments/active")).data.data,
  get_paginated: async (query: DepartmentListQuery) =>
    (
      await api.get<ApiEnvelope<PaginatedResult<AdminDepartment>>>("/departments", {
        params: query,
      })
    ).data.data,
  get_by_id: async (id: string) =>
    (await api.get<ApiEnvelope<AdminDepartment>>(`/departments/${id}`)).data.data,
});

export default core_api;
