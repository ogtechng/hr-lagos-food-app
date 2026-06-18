import type { AxiosInstance } from "axios";

import core_api from "./core_api";

export const make_reports_service = (api: AxiosInstance) => ({
  ...core_api(api),
});
