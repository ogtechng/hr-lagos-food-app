import type { AxiosInstance } from "axios";

import type { ApplicationStatusEvent } from "@/app/api/_db/schema";
import type { ApplicationFilters } from "@/app/api/_schemas/applications/application.schema";

type ApiEnvelope<T> = { data: T };

export type AdminApplicationListItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  status: "submitted" | "accepted" | "rejected";
  createdAt: Date;
  jobTitle: string;
  entityName: string;
};

export type AdminApplicationDetail = AdminApplicationListItem & {
  address: string;
  cvUrl: string;
  cvFileName: string | null;
  cvStoragePath: string | null;
  coverLetterUrl: string | null;
  coverLetterFileName: string | null;
  coverLetterStoragePath: string | null;
  adminNote: string | null;
};

const core_api = (api: AxiosInstance) => ({
  get_all: async (filters?: ApplicationFilters) =>
    (await api.get<ApiEnvelope<AdminApplicationListItem[]>>("/applications", { params: filters }))
      .data.data,
  get_by_id: async (id: string) =>
    (await api.get<ApiEnvelope<AdminApplicationDetail>>(`/applications/${id}`)).data.data,
  get_status_events: async (id: string) =>
    (await api.get<ApiEnvelope<ApplicationStatusEvent[]>>(`/applications/${id}/status-events`)).data
      .data,
});

export default core_api;
