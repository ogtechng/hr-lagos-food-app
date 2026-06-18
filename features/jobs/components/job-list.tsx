import { EmptyState } from "@/components/shared/empty-state";
import { JobCard } from "@/features/jobs/components/job-card";
import type { PublicJob } from "@/features/jobs/types/job-display.types";

interface JobListProps {
  jobs: PublicJob[];
}

export function JobList({ jobs }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <EmptyState
        title="No published roles match this search"
        description="Try adjusting your filters or check back when new hiring rounds open."
      />
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
