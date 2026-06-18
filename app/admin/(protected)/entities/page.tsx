import { requireAdmin } from "@/app/api/_auth/require-admin";
import { AdminPageShell } from "@/components/shared/admin-page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntitiesTable } from "@/features/entities/components/admin/entities-table";
import { EntityForm } from "@/features/entities/components/admin/entity-form";
import { make_entities_service } from "@/features/entities/services";
import { createServerApiClient } from "@/lib/server-api-client";

export const dynamic = "force-dynamic";

export default async function AdminEntitiesPage() {
  await requireAdmin();
  const api = await createServerApiClient();
  const entities = await make_entities_service(api).get_all();
  const activeEntities = entities.filter((entity) => entity.isActive).length;

  return (
    <AdminPageShell>
      <PageHeader
        backHref="/admin"
        title="Hiring"
        titleAccent="entities"
        description="Create and manage the hiring entities that publish roles on the public portal."
      />

      <div className="grid gap-5 xl:grid-cols-[24rem_1fr] xl:items-start">
        <div className="grid gap-5 xl:sticky xl:top-6">
          <Card className="border-[#dcd7cb] bg-[#fbfaf6]">
            <CardHeader>
              <CardTitle>Create entity</CardTitle>
              <p className="text-sm leading-6 text-muted-foreground">
                Add a business unit, brand, or operation that can own jobs.
              </p>
            </CardHeader>
            <CardContent>
              <EntityForm />
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-[#dcd7cb] bg-[#f4f1e8]">
            <div className="border-r border-[#dcd7cb] p-5">
              <p className="text-xs font-medium text-muted-foreground">Total entities</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{entities.length}</p>
            </div>
            <div className="p-5">
              <p className="text-xs font-medium text-muted-foreground">Active</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-[#085b31]">
                {activeEntities}
              </p>
            </div>
          </div>
        </div>

        <EntitiesTable entities={entities} />
      </div>
    </AdminPageShell>
  );
}
