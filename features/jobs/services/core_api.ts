import type { AxiosInstance } from "axios";

import type { Job } from "@/app/api/_db/schema";
import type { JobFilters } from "@/app/api/_schemas/jobs/job.schema";
import type { PublicJob } from "@/features/jobs/types/job-display.types";

type ApiEnvelope<T> = { data: T };
export type AdminJob = Job & {
  entityName: string;
  entitySlug: string;
};

function toParams(filters?: JobFilters) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters ?? {})) {
    if (value) params.set(key, String(value));
  }

  return params;
}

const core_api = (api: AxiosInstance) => ({
  get_all: async (filters?: JobFilters) =>
    (
      await api.get<ApiEnvelope<AdminJob[]>>("/jobs", {
        params: Object.fromEntries(toParams(filters)),
      })
    ).data.data,
  get_published: async (filters?: Omit<JobFilters, "status">) =>
    (
      await api.get<ApiEnvelope<PublicJob[]>>("/jobs/published", {
        params: Object.fromEntries(toParams(filters)),
      })
    ).data.data,
  get_by_id: async (id: string) => (await api.get<ApiEnvelope<Job>>(`/jobs/${id}`)).data.data,
  get_published_by_id: async (id: string) =>
    (await api.get<ApiEnvelope<PublicJob>>(`/jobs/published/${id}`)).data.data,
  get_published_by_slug: async (slug: string) =>
    (await api.get<ApiEnvelope<PublicJob>>(`/jobs/slug/${encodeURIComponent(slug)}`)).data.data,
});

export default core_api;
