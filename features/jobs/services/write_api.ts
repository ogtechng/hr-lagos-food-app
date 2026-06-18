import type { AxiosInstance } from "axios";

import type { CreateJobInput, UpdateJobInput } from "@/app/api/_schemas/jobs/job.schema";

const write_api = (api: AxiosInstance) => ({
  create: (data: CreateJobInput) => api.post("/jobs", data),
  update: (id: string, data: UpdateJobInput) => api.patch(`/jobs/${id}`, data),
  publish: (id: string) => api.patch(`/jobs/${id}/publish`),
  close: (id: string) => api.patch(`/jobs/${id}/close`),
});

export default write_api;
