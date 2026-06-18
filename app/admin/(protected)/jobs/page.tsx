import Link from "next/link";
import { BriefcaseBusiness, CheckCircle2, CircleDashed, LockKeyhole } from "lucide-react";

import { requireAdmin } from "@/app/api/_auth/require-admin";
import { jobFiltersSchema } from "@/app/api/_schemas/jobs/job.schema";
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
  const filters = jobFiltersSchema.parse({
    search: first(raw.search),
    status: first(raw.status) || undefined,
  });
  const api = await createServerApiClient();
  const jobs = await make_jobs_service(api).get_all(filters);
  const allJobs = await make_jobs_service(api).get_all();
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
        <Button nativeButton={false} render={<Link href="/admin/jobs/new" />}>
          New job
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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

      <form className="grid gap-3 rounded-3xl border border-[#ddd8cc] bg-[#fbfaf6] p-4 md:grid-cols-[1fr_14rem_auto] md:items-end">
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
            className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"
          >
            <option value="">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="closed">Closed</option>
          </select>
        </label>
        <Button type="submit">Filter</Button>
      </form>
      <JobsTable jobs={jobs} />
    </AdminPageShell>
  );
}
