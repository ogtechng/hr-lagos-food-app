import type { JobStatus } from "@/app/api/_db/schema";

/** Static select options for the job admin form. */
export const JOB_STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "closed", label: "Closed" },
];
