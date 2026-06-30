import type { JobStatus } from "@/app/api/_db/schema";

/** Static select options for the job admin form. */
export const JOB_STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "closed", label: "Closed" },
];

export const EMPLOYMENT_TYPE_OPTIONS = [
  "Full-time",
  "Part-time",
  "Contract",
] as const;
