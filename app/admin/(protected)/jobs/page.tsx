import Link from "next/link";
import { BriefcaseBusiness, CheckCircle2, CircleDashed, LockKeyhole, Plus } from "lucide-react";

import { requireAdmin } from "@/app/api/_auth/require-admin";
import { adminJobListQuerySchema, jobFiltersSchema } from "@/app/api/_schemas/jobs/job.schema";
import { AdminPageShell } from "@/components/shared/admin-page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JobsTable } from "@/features/jobs/components/admin/jobs-table";
import { make_jobs_service } from "@/features/jobs/services";
import { createServerApiClient } from "@/lib/server-api-client";

type AdminJobsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminJobsPage({ searchParams }: AdminJobsPageProps) {
  await requireAdmin();
  const raw = (await searchParams) ?? {};
  const query = adminJobListQuerySchema.parse({
    search: first(raw.search),
    status: first(raw.status) || undefined,
    page: first(raw.page),
    pageSize: first(raw.pageSize),
    sortBy: first(raw.sortBy),
    sortDir: first(raw.sortDir),
  });
  const api = await createServerApiClient();
  const jobsService = make_jobs_service(api);
  const jobs = await jobsService.get_paginated(query);
  const allJobs = await jobsService.get_all(jobFiltersSchema.parse({}));
  const published = allJobs.filter((job) => job.status === "published").length;
  const draft = allJobs.filter((job) => job.status === "draft").length;
  const closed = allJobs.filter((job) => job.status === "closed").length;

  return (
    <AdminPageShell>
      <PageHeader
        backHref="/admin"
        title="Job"
        titleAccent="operations"
        description="Create, edit, publish, and close jobs."
      >
        <Button
          nativeButton={false}
          className="bg-[var(--admin-lemon)] text-[var(--admin-primary)] hover:bg-[var(--admin-lemon)]/80"
          render={<Link href="/admin/jobs/new" />}
        >
          <Plus className="size-4" aria-hidden="true" />
          New job
        </Button>
      </PageHeader>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total jobs"
          value={allJobs.length}
          description="All roles across entities"
          icon={<BriefcaseBusiness className="size-4" aria-hidden="true" />}
        />
        <StatsCard
          title="Published"
          value={published}
          description="Visible on public jobs"
          icon={<CheckCircle2 className="size-4" aria-hidden="true" />}
        />
        <StatsCard
          title="Draft"
          value={draft}
          description="Not visible publicly"
          icon={<CircleDashed className="size-4" aria-hidden="true" />}
        />
        <StatsCard
          title="Closed"
          value={closed}
          description="No longer accepting"
          icon={<LockKeyhole className="size-4" aria-hidden="true" />}
        />
      </div>

      <form className="admin-filter-panel grid gap-3 rounded-lg p-3 md:grid-cols-[1fr_14rem_auto] md:items-end">
        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Search
          </span>
          <Input name="search" placeholder="Search jobs" defaultValue={first(raw.search)} />
        </label>
        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Status
          </span>
          <select
            name="status"
            defaultValue={first(raw.status) ?? ""}
            className="admin-control h-9 border border-input bg-background px-2.5 text-sm"
          >
            <option value="">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="closed">Closed</option>
          </select>
        </label>
        <Button type="submit">Filter</Button>
      </form>
      <JobsTable result={jobs} />
    </AdminPageShell>
  );
}
