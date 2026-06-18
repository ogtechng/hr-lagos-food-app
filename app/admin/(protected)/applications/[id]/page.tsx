import { notFound } from "next/navigation";

import { requireAdmin } from "@/app/api/_auth/require-admin";
import { applicationIdParamSchema } from "@/app/api/_schemas/applications/application.schema";
import { AdminPageShell } from "@/components/shared/admin-page-shell";
import { BackButton } from "@/components/shared/back-button";
import { ApplicationDetail } from "@/features/applications/components/admin/application-detail";
import { make_applications_service } from "@/features/applications/services";
import { createServerApiClient } from "@/lib/server-api-client";

type AdminApplicationDetailPageProps = {
  params: Promise<unknown>;
};

export const dynamic = "force-dynamic";

export default async function AdminApplicationDetailPage({
  params,
}: AdminApplicationDetailPageProps) {
  await requireAdmin();
  const { id } = applicationIdParamSchema.parse(await params);
  const api = await createServerApiClient();
  const applicationsService = make_applications_service(api);
  const [application, events] = await Promise.all([
    applicationsService.get_by_id(id).catch(() => null),
    applicationsService.get_status_events(id),
  ]);

  if (!application) notFound();

  return (
    <AdminPageShell>
      <BackButton href="/admin/applications" label="Back to applications" />
      <ApplicationDetail application={application} events={events} />
    </AdminPageShell>
  );
}
