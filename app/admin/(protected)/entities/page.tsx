import { requireAdmin } from "@/app/api/_auth/require-admin";
import { entityListQuerySchema } from "@/app/api/_schemas/entities/entity.schema";
import { AdminPageShell } from "@/components/shared/admin-page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateEntityDialog } from "@/features/entities/components/admin/create-entity-dialog";
import { EntitiesTable } from "@/features/entities/components/admin/entities-table";
import { make_entities_service } from "@/features/entities/services";
import { createServerApiClient } from "@/lib/server-api-client";

export const dynamic = "force-dynamic";

type AdminEntitiesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminEntitiesPage({ searchParams }: AdminEntitiesPageProps) {
  await requireAdmin();
  const raw = (await searchParams) ?? {};
  const query = entityListQuerySchema.parse({
    search: first(raw.search),
    status: first(raw.status) || undefined,
    page: first(raw.page),
    pageSize: first(raw.pageSize),
    sortBy: first(raw.sortBy),
    sortDir: first(raw.sortDir),
  });
  const api = await createServerApiClient();
  const entitiesService = make_entities_service(api);
  const [entities, paginatedEntities] = await Promise.all([
    entitiesService.get_all(),
    entitiesService.get_paginated(query),
  ]);
  const activeEntities = entities.filter((entity) => entity.isActive).length;

  return (
    <AdminPageShell>
      <PageHeader
        backHref="/admin"
        title="Hiring"
        titleAccent="entities"
        description="Create and manage the hiring entities that publish roles on the public portal."
      >
        <CreateEntityDialog />
      </PageHeader>

      <div className="dashboard-soft-ring mb-4 grid grid-cols-2 overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-panel)]">
        <div className="border-r border-[var(--admin-border)] p-4">
          <p className="text-xs font-medium text-muted-foreground">Total entities</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{entities.length}</p>
        </div>
        <div className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Active</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
            {activeEntities}
          </p>
        </div>
      </div>

      <form className="admin-filter-panel mb-4 grid gap-3 rounded-lg p-3 md:grid-cols-[1fr_14rem_auto] md:items-end">
        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Search
          </span>
          <Input name="search" placeholder="Search entities" defaultValue={first(raw.search)} />
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
        <Button type="submit">Filter</Button>
      </form>
      <EntitiesTable result={paginatedEntities} />
    </AdminPageShell>
  );
}
