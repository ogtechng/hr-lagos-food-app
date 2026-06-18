import { BriefcaseBusiness } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { JobFilters } from "@/features/jobs/components/job-filters";
import { JobList } from "@/features/jobs/components/job-list";
import { publicJobFiltersSchema } from "@/features/jobs/schemas/public-job-filters.schema";
import { make_entities_service } from "@/features/entities/services";
import { make_jobs_service } from "@/features/jobs/services";
import type { PublicJob } from "@/features/jobs/types/job-display.types";
import type { Entity } from "@/app/api/_db/schema";
import { createServerApiClient } from "@/lib/server-api-client";

export const dynamic = "force-dynamic";

type JobsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function uniqueValues(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value)))).sort();
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const rawSearchParams = (await searchParams) ?? {};
  const filters = publicJobFiltersSchema.parse(rawSearchParams);

  let jobs: PublicJob[] = [];
  let allJobs: PublicJob[] = [];
  let entities: Entity[] = [];

  try {
    const api = await createServerApiClient();
    const jobsService = make_jobs_service(api);
    const entitiesService = make_entities_service(api);
    [jobs, allJobs, entities] = await Promise.all([
      jobsService.get_published({
        search: filters.q,
        entitySlug: filters.entity,
        location: filters.location,
        employmentType: filters.employmentType,
      }),
      jobsService.get_published(),
      entitiesService.get_active(),
    ]);
  } catch {
    jobs = [];
    allJobs = [];
    entities = [];
  }

  return (
    <Section className="py-12 md:py-16">
      <Container className="space-y-8">
        <div className="hero-noise relative overflow-hidden rounded-[1.25rem] border border-[#0c5b30] px-6 py-8 text-[#f2f0e6] md:px-10 md:py-10">
          <div className="relative flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#78a783] px-3 py-1 text-xs font-medium text-[#c7ddbd]">
                <BriefcaseBusiness className="size-3.5" aria-hidden="true" />
                Open roles
              </span>
              <span className="hidden text-xs font-medium text-[#bfd8bc] sm:block">
                {jobs.length} {jobs.length === 1 ? "role" : "roles"} available
              </span>
            </div>
            <h1 className="max-w-3xl font-display text-3xl leading-tight tracking-tight md:text-4xl">
              Find your next role across <span className="text-[#dfff67]">Lagos food teams.</span>
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-[#d9e8d2] md:text-base">
              Search roles across active Lagos food entities by title, team, location, and work
              type.
            </p>
          </div>
        </div>

        <JobFilters
          filters={filters}
          entities={entities}
          locations={uniqueValues(allJobs.map((job) => job.location))}
          employmentTypes={uniqueValues(allJobs.map((job) => job.employmentType))}
        />
        <JobList jobs={jobs} />
      </Container>
    </Section>
  );
}
