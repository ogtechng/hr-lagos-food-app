import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Building2, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { JobStatusBadge } from "@/features/jobs/components/job-status-badge";
import type { PublicJob } from "@/features/jobs/types/job-display.types";

function TextBlock({ title, content }: { title: string; content: string | null }) {
  if (!content) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">{content}</p>
    </section>
  );
}

interface JobDetailProps {
  job: PublicJob;
}

export function JobDetail({ job }: JobDetailProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <article className="space-y-8">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <JobStatusBadge employmentType={job.employmentType} />
            {job.department && (
              <span className="text-sm font-medium text-muted-foreground">{job.department}</span>
            )}
          </div>
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{job.title}</h1>
            <p className="text-lg leading-8 text-muted-foreground">
              {job.description ?? "Open role across the My Lagos Food hiring network."}
            </p>
          </div>
        </div>

        <TextBlock title="Responsibilities" content={job.responsibilities} />
        <TextBlock title="Requirements" content={job.requirements} />
      </article>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Card>
          <CardContent className="space-y-6">
            <div className="space-y-4 text-sm">
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
                  <BriefcaseBusiness
                    className="mt-0.5 size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold">Department</p>
                    <p className="text-muted-foreground">{job.department}</p>
                  </div>
                </div>
              )}
            </div>
            <Button
              nativeButton={false}
              size="lg"
              className="w-full"
              render={<Link href={`/apply/${job.id}`} />}
            >
              Apply for this role
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
