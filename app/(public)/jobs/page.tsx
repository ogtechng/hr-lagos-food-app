import Link from "next/link";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { jobFamilies } from "@/config/public-careers-content";
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

function mergedDepartments(jobs: PublicJob[]) {
  return Array.from(new Set([...jobFamilies, ...uniqueValues(jobs.map((job) => job.department))]));
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
        department: filters.department,
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
    <Section className="bg-[#f7f5ef] py-12 md:py-16">
      <Container className="space-y-8">
        <div className="hero-noise relative overflow-hidden border border-[#0c5b30] bg-[#0a5a32] px-6 py-8 text-[#f2f0e6] md:px-10 md:py-10">
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
              Find your next role across{" "}
              <span className="text-[#dfff67]">Produce for Lagos companies.</span>
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-[#d9e8d2] md:text-base">
              Search by company, function, location, work type, or role title across P4L Fund,
              LAFSINCO, BulkFood, and EkoLog.
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {jobFamilies.map((family) => (
            <Link
              key={family}
              href={`/jobs?department=${encodeURIComponent(family)}`}
              className="group flex min-h-14 items-center justify-between gap-3 border border-[#d8d3c7] bg-white/80 px-4 py-3 text-sm font-semibold text-[#243526] transition-colors hover:border-[#7fad70] hover:bg-[#eef5e8]"
            >
              {family}
              <ArrowRight
                className="size-4 shrink-0 text-[#0a5a32] transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>

        <JobFilters
          filters={filters}
          entities={entities}
          departments={mergedDepartments(allJobs)}
          locations={uniqueValues(allJobs.map((job) => job.location))}
          employmentTypes={uniqueValues(allJobs.map((job) => job.employmentType))}
        />
        <JobList jobs={jobs} />
      </Container>
    </Section>
  );
}
