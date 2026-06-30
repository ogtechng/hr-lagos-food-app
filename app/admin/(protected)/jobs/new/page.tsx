import { requireAdmin } from "@/app/api/_auth/require-admin";
import { AdminPageShell } from "@/components/shared/admin-page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { JobForm } from "@/features/jobs/components/admin/job-form";
import { make_departments_service } from "@/features/departments/services";
import { make_entities_service } from "@/features/entities/services";
import { createServerApiClient } from "@/lib/server-api-client";

export const dynamic = "force-dynamic";

export default async function NewJobPage() {
  await requireAdmin();
  const api = await createServerApiClient();
  const [entities, departments] = await Promise.all([
    make_entities_service(api).get_active(),
    make_departments_service(api).get_active(),
  ]);

  return (
    <AdminPageShell>
      <PageHeader
        backHref="/admin/jobs"
        title="Create"
        titleAccent="job"
        description="Create a role, connect it to an entity, and decide whether it should publish now or stay in draft."
      />
      <div className="grid gap-5 xl:grid-cols-[18rem_1fr] xl:items-start">
        <aside className="dashboard-soft-ring rounded-lg border border-[var(--admin-border)] bg-[var(--admin-panel)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Setup guide
          </p>
          <div className="mt-5 space-y-4 text-sm leading-6 text-muted-foreground">
            <p>Use draft while role copy is still being prepared.</p>
            <p>Published jobs are visible on the public jobs page and application flow.</p>
          </div>
        </aside>
        <Card className="dashboard-soft-ring border-[var(--admin-border)] bg-[var(--admin-panel)]">
          <CardContent className="p-4">
            <JobForm entities={entities} departments={departments} />
          </CardContent>
        </Card>
      </div>
    </AdminPageShell>
  );
}
