import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/features/jobs/components/job-card";
import type { PublicJob } from "@/features/jobs/types/job-display.types";

interface FeaturedJobsProps {
  jobs: PublicJob[];
}

export function FeaturedJobs({ jobs }: FeaturedJobsProps) {
  if (jobs.length === 0) {
    return (
      <EmptyState
        title="No open roles yet"
        description="Published jobs will appear here as soon as the team opens a hiring round."
        action={
          <Button nativeButton={false} variant="outline" render={<Link href="/jobs" />}>
            Browse jobs
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.95fr_1.05fr]">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
      <Button
        nativeButton={false}
        variant="outline"
        className="border-[#9fc58f] bg-white/60 text-[#245438] hover:bg-[#e6f4d9]"
        render={<Link href="/jobs" />}
      >
        View all open roles
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
