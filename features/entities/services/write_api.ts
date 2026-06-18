import type { AxiosInstance } from "axios";

import type {
  CreateEntityInput,
  UpdateEntityInput,
} from "@/app/api/_schemas/entities/entity.schema";

const write_api = (api: AxiosInstance) => ({
  create: (data: CreateEntityInput) => api.post("/entities", data),
  update: (id: string, data: UpdateEntityInput) => api.patch(`/entities/${id}`, data),
  activate: (id: string) => api.patch(`/entities/${id}/activate`),
  deactivate: (id: string) => api.patch(`/entities/${id}`, { isActive: false }),
  delete: (id: string) => api.delete(`/entities/${id}`),
});

export default write_api;
