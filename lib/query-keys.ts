/**
 * Central React Query key registry.
 *
 * Keep all query keys here so query and mutation hooks invalidate consistently.
 */
export const query_keys = {
  jobs: ["jobs"] as const,
  job: (id: string) => ["jobs", id] as const,
  entities: ["entities"] as const,
  entity: (id: string) => ["entities", id] as const,
  applications: ["applications"] as const,
  application: (id: string) => ["applications", id] as const,
};

export default query_keys;
