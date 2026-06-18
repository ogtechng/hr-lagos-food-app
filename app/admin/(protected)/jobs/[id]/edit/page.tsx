import { notFound } from "next/navigation";

import { requireAdmin } from "@/app/api/_auth/require-admin";
import { jobIdParamSchema } from "@/app/api/_schemas/jobs/job.schema";
import { AdminPageShell } from "@/components/shared/admin-page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { JobForm } from "@/features/jobs/components/admin/job-form";
import { make_entities_service } from "@/features/entities/services";
import { make_jobs_service } from "@/features/jobs/services";
import { createServerApiClient } from "@/lib/server-api-client";

type EditJobPageProps = { params: Promise<unknown> };

export const dynamic = "force-dynamic";

export default async function EditJobPage({ params }: EditJobPageProps) {
  await requireAdmin();
  const { id } = jobIdParamSchema.parse(await params);
  const api = await createServerApiClient();
  const jobsService = make_jobs_service(api);
  const entitiesService = make_entities_service(api);
  const [job, entities] = await Promise.all([
    jobsService.get_by_id(id).catch(() => null),
    entitiesService.get_all(),
  ]);

  if (!job) notFound();

  return (
    <AdminPageShell>
      <PageHeader backHref="/admin/jobs" title="Edit" titleAccent="job" description={job.title} />
      <div className="grid gap-5 xl:grid-cols-[18rem_1fr] xl:items-start">
        <aside className="rounded-3xl border border-[#ddd8cc] bg-[#f4f1e8] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Current state
          </p>
          <p className="mt-4 font-display text-3xl capitalize tracking-tight">{job.status}</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Published jobs appear publicly. Closing a job keeps the record while stopping new
            applications.
          </p>
        </aside>
        <Card className="border-[#ddd8cc] bg-[#fbfaf6]">
          <CardContent>
            <JobForm job={job} entities={entities} />
          </CardContent>
        </Card>
      </div>
    </AdminPageShell>
  );
}
