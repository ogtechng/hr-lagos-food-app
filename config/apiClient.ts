import axios from "axios";

/**
 * Browser-side Axios client. Hits the internal API under `/api/v1`.
 * Same-origin requests send Supabase auth cookies automatically, so the
 * API route handlers can enforce `requireAdmin()` on every mutation.
 */
export const apiClient = axios.create({
  baseURL: "/api/v1",
});

/**
 * Hook accessor for the browser API client, mirroring press-release-v2's
 * `usePrivateApi()` so feature hooks consume the client the same way.
 */
export function useApi() {
  return apiClient;
}

export default apiClient;
