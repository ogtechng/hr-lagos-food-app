import { BriefcaseBusiness, Building2, MapPin } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobStatusBadge } from "@/features/jobs/components/job-status-badge";
import type { PublicJob } from "@/features/jobs/types/job-display.types";

interface ApplicationJobSummaryProps {
  job: PublicJob;
}

export function ApplicationJobSummary({ job }: ApplicationJobSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Applying for</p>
            <CardTitle className="mt-1 text-2xl">{job.title}</CardTitle>
          </div>
          <JobStatusBadge employmentType={job.employmentType} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex gap-3">
          <Building2 className="mt-0.5 size-4 text-muted-foreground" aria-hidden="true" />
          <div>
            <p className="font-semibold">Entity</p>
            <p className="text-muted-foreground">{job.entityName}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <MapPin className="mt-0.5 size-4 text-muted-foreground" aria-hidden="true" />
          <div>
            <p className="font-semibold">Location</p>
            <p className="text-muted-foreground">{job.location}</p>
          </div>
        </div>
        {job.department && (
          <div className="flex gap-3">
            <BriefcaseBusiness className="mt-0.5 size-4 text-muted-foreground" aria-hidden="true" />
            <div>
              <p className="font-semibold">Department</p>
              <p className="text-muted-foreground">{job.department}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
