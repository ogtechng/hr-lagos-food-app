import { requireAdmin } from "@/app/api/_auth/require-admin";
import { AdminPageShell } from "@/components/shared/admin-page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { JobForm } from "@/features/jobs/components/admin/job-form";
import { make_entities_service } from "@/features/entities/services";
import { createServerApiClient } from "@/lib/server-api-client";

export const dynamic = "force-dynamic";

export default async function NewJobPage() {
  await requireAdmin();
  const api = await createServerApiClient();
  const entities = await make_entities_service(api).get_active();

  return (
    <AdminPageShell>
      <PageHeader
        backHref="/admin/jobs"
        title="Create"
        titleAccent="job"
        description="Create a role, connect it to an entity, and decide whether it should publish now or stay in draft."
      />
      <div className="grid gap-5 xl:grid-cols-[18rem_1fr] xl:items-start">
        <aside className="rounded-3xl border border-[#ddd8cc] bg-[#f4f1e8] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Setup guide
          </p>
          <div className="mt-5 space-y-4 text-sm leading-6 text-muted-foreground">
            <p>Use draft while role copy is still being prepared.</p>
            <p>Published jobs are visible on the public jobs page and application flow.</p>
          </div>
        </aside>
        <Card className="border-[#ddd8cc] bg-[#fbfaf6]">
          <CardContent>
            <JobForm entities={entities} />
          </CardContent>
        </Card>
      </div>
    </AdminPageShell>
  );
}
