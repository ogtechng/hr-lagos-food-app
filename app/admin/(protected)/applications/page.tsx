import { CheckCircle2, Clock3, FileText, XCircle } from "lucide-react";

import { requireAdmin } from "@/app/api/_auth/require-admin";
import { applicationFiltersSchema } from "@/app/api/_schemas/applications/application.schema";
import { AdminPageShell } from "@/components/shared/admin-page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { ApplicationFilters } from "@/features/applications/components/admin/application-filters";
import { ApplicationsTable } from "@/features/applications/components/admin/applications-table";
import { make_applications_service } from "@/features/applications/services";
import { make_entities_service } from "@/features/entities/services";
import { make_jobs_service } from "@/features/jobs/services";
import { createServerApiClient } from "@/lib/server-api-client";

type AdminApplicationsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminApplicationsPage({ searchParams }: AdminApplicationsPageProps) {
  await requireAdmin();
  const raw = (await searchParams) ?? {};
  const filters = applicationFiltersSchema.parse({
    search: first(raw.search) || undefined,
    jobId: first(raw.jobId) || undefined,
    entityId: first(raw.entityId) || undefined,
    status: first(raw.status) || undefined,
    createdFrom: first(raw.createdFrom) || undefined,
    createdTo: first(raw.createdTo) || undefined,
  });

  const api = await createServerApiClient();
  const applicationsService = make_applications_service(api);
  const jobsService = make_jobs_service(api);
  const entitiesService = make_entities_service(api);
  const [applications, jobs, entities] = await Promise.all([
    applicationsService.get_all(filters),
    jobsService.get_all(),
    entitiesService.get_all(),
  ]);
  const allApplications = await applicationsService.get_all();
  const submitted = allApplications.filter(
    (application) => application.status === "submitted",
  ).length;
  const accepted = allApplications.filter(
    (application) => application.status === "accepted",
  ).length;
  const rejected = allApplications.filter(
    (application) => application.status === "rejected",
  ).length;

  return (
    <AdminPageShell>
      <PageHeader
        backHref="/admin"
        title="Applicant"
        titleAccent="review"
        description="Review applicants, inspect CVs, and keep hiring decisions moving."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total"
          value={allApplications.length}
          description="Applications received"
          icon={<FileText className="size-4" aria-hidden="true" />}
        />
        <StatsCard
          title="Submitted"
          value={submitted}
          description="Needs review"
          icon={<Clock3 className="size-4" aria-hidden="true" />}
        />
        <StatsCard
          title="Accepted"
          value={accepted}
          description="Moved forward"
          icon={<CheckCircle2 className="size-4" aria-hidden="true" />}
        />
        <StatsCard
          title="Rejected"
          value={rejected}
          description="Closed out"
          icon={<XCircle className="size-4" aria-hidden="true" />}
        />
      </div>
      <ApplicationFilters
        jobs={jobs.map((job) => ({ id: job.id, label: job.title }))}
        entities={entities.map((entity) => ({ id: entity.id, label: entity.name }))}
        searchParams={{
          search: first(raw.search),
          jobId: first(raw.jobId),
          entityId: first(raw.entityId),
          status: first(raw.status),
          createdFrom: first(raw.createdFrom),
          createdTo: first(raw.createdTo),
        }}
      />
      <ApplicationsTable applications={applications} />
    </AdminPageShell>
  );
}
