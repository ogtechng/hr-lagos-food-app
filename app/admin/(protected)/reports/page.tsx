import { requireAdmin } from "@/app/api/_auth/require-admin";
import { reportQuerySchema, type ReportFilters } from "@/app/api/_schemas/reports/report.schema";
import { AdminPageShell } from "@/components/shared/admin-page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { make_entities_service } from "@/features/entities/services";
import { make_jobs_service } from "@/features/jobs/services";
import { ReportsExportButton } from "@/features/reports/components/reports-export-button";
import { ReportsFilters } from "@/features/reports/components/reports-filters";
import { ReportsSummaryCards } from "@/features/reports/components/reports-summary-cards";
import { ReportsTable } from "@/features/reports/components/reports-table";
import { make_reports_service } from "@/features/reports/services";
import { createServerApiClient } from "@/lib/server-api-client";

export const dynamic = "force-dynamic";

type ReportsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function buildSearchParams(raw: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();

  for (const key of ["dateFrom", "dateTo", "entity", "job", "status"]) {
    const value = first(raw[key]);
    if (value) params.set(key, value);
  }

  return params;
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  await requireAdmin();
  const raw = (await searchParams) ?? {};
  const parsedFilters = reportQuerySchema.safeParse(raw);
  const filters: ReportFilters = parsedFilters.success ? parsedFilters.data : {};
  const params = buildSearchParams(raw);

  const api = await createServerApiClient();
  const reportsService = make_reports_service(api);
  const entitiesService = make_entities_service(api);
  const jobsService = make_jobs_service(api);
  const [rows, summary, entities, jobs] = await Promise.all([
    reportsService.get_applications(filters),
    reportsService.get_applications_summary(filters),
    entitiesService.get_all(),
    jobsService.get_all(),
  ]);

  return (
    <AdminPageShell>
      <PageHeader
        backHref="/admin"
        title="Application"
        titleAccent="reports"
        description="Filter applications and export a clean CSV."
      >
        <ReportsExportButton searchParams={params} />
      </PageHeader>
      {!parsedFilters.success && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Some filters were invalid, so the report was reset.
        </div>
      )}
      <ReportsFilters
        entities={entities}
        jobs={jobs.map((job) => ({ id: job.id, title: job.title }))}
        values={{
          dateFrom: first(raw.dateFrom),
          dateTo: first(raw.dateTo),
          entity: first(raw.entity),
          job: first(raw.job),
          status: first(raw.status),
        }}
      />
      <ReportsSummaryCards summary={summary} />
      <ReportsTable rows={rows} />
    </AdminPageShell>
  );
}
