import type { AxiosInstance } from "axios";

import core_api from "./core_api";
import write_api from "./write_api";

export const make_applications_service = (api: AxiosInstance) => ({
  ...core_api(api),
  ...write_api(api),
});
