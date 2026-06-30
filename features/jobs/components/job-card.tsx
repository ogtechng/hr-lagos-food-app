import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, MapPin } from "lucide-react";

import { JobStatusBadge } from "@/features/jobs/components/job-status-badge";
import type { PublicJob } from "@/features/jobs/types/job-display.types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function getExcerpt(description: string | null) {
  if (!description) {
    return "Open role across the Produce for Lagos hiring network.";
  }

  const text = description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

  return text.length > 150 ? `${text.slice(0, 147)}...` : text;
}

interface JobCardProps {
  job: PublicJob;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="h-full border-[#c7dec4] bg-white/70 transition-colors hover:border-[#7fad70]">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#4f7f3b]">{job.entityName}</p>
            <CardTitle className="mt-1 text-xl text-[#173526]">{job.title}</CardTitle>
          </div>
          <JobStatusBadge employmentType={job.employmentType} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5">
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#557057]">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4" aria-hidden="true" />
            {job.location}
          </span>
          {job.department && (
            <span className="inline-flex items-center gap-1.5">
              <BriefcaseBusiness className="size-4" aria-hidden="true" />
              {job.department}
            </span>
          )}
        </div>
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
          {getExcerpt(job.description)}
        </p>
      </CardContent>
      <CardFooter>
        <Button
          nativeButton={false}
          variant="ghost"
          className="w-full justify-between text-[#245438] hover:bg-[#e6f4d9]"
          render={<Link href={`/jobs/${job.slug}`} />}
        >
          View details
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Button>
      </CardFooter>
    </Card>
  );
}
