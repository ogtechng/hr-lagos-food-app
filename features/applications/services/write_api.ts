import type { AxiosInstance } from "axios";

import type { UpdateApplicationStatusInput } from "@/app/api/_schemas/applications/application.schema";

const write_api = (api: AxiosInstance) => ({
  create_public: (data: FormData) => api.post("/applications", data),
  update_status: (id: string, data: UpdateApplicationStatusInput) =>
    api.patch(`/applications/${id}/status`, data),
  update_admin_note: (id: string, adminNote: string | null) =>
    api.patch(`/applications/${id}/note`, { adminNote }),
});

export default write_api;
