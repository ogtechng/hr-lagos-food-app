import type { AxiosInstance } from "axios";

import type {
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from "@/app/api/_schemas/departments/department.schema";

const write_api = (api: AxiosInstance) => ({
  create: (data: CreateDepartmentInput) => api.post("/departments", data),
  update: (id: string, data: UpdateDepartmentInput) => api.patch(`/departments/${id}`, data),
  delete: (id: string) => api.delete(`/departments/${id}`),
});

export default write_api;
