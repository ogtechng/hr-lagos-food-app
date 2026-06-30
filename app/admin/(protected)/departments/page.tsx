import { requireAdmin } from "@/app/api/_auth/require-admin";
import { departmentListQuerySchema } from "@/app/api/_schemas/departments/department.schema";
import { AdminPageShell } from "@/components/shared/admin-page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DepartmentForm } from "@/features/departments/components/admin/department-form";
import { DepartmentsTable } from "@/features/departments/components/admin/departments-table";
import { make_departments_service } from "@/features/departments/services";
import { make_entities_service } from "@/features/entities/services";
import { createServerApiClient } from "@/lib/server-api-client";

export const dynamic = "force-dynamic";

type DepartmentsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function DepartmentsPage({ searchParams }: DepartmentsPageProps) {
  await requireAdmin();
  const raw = (await searchParams) ?? {};
  const query = departmentListQuerySchema.parse({
    search: first(raw.search),
    entityId: first(raw.entityId) || undefined,
    status: first(raw.status) || undefined,
    page: first(raw.page),
    pageSize: first(raw.pageSize),
    sortBy: first(raw.sortBy),
    sortDir: first(raw.sortDir),
  });
  const api = await createServerApiClient();
  const departmentsService = make_departments_service(api);
  const entitiesService = make_entities_service(api);
  const [departments, paginatedDepartments, entities] = await Promise.all([
    departmentsService.get_all(),
    departmentsService.get_paginated(query),
    entitiesService.get_active(),
  ]);
  const activeDepartments = departments.filter((department) => department.isActive).length;

  return (
    <AdminPageShell>
      <PageHeader
        backHref="/admin"
        title="Job"
        titleAccent="departments"
        description="Manage the department choices used when creating jobs."
      />

      <div className="grid gap-5 xl:grid-cols-[24rem_1fr] xl:items-start">
        <div className="grid gap-5 xl:sticky xl:top-6">
          <Card className="dashboard-soft-ring border-[var(--admin-border)] bg-[var(--admin-panel)]">
            <CardHeader>
              <CardTitle>Create department</CardTitle>
              <p className="text-sm leading-6 text-muted-foreground">
                Departments are stored centrally, then copied as text into job records.
              </p>
            </CardHeader>
            <CardContent>
              <DepartmentForm entities={entities} />
            </CardContent>
          </Card>

          <div className="dashboard-soft-ring grid grid-cols-2 overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-panel)]">
            <div className="border-r border-[var(--admin-border)] p-4">
              <p className="text-xs font-medium text-muted-foreground">Total departments</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{departments.length}</p>
            </div>
            <div className="p-4">
              <p className="text-xs font-medium text-muted-foreground">Active</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
                {activeDepartments}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <form className="admin-filter-panel grid gap-3 rounded-lg p-3 md:grid-cols-[1fr_14rem_14rem_auto] md:items-end">
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Search
              </span>
              <Input
                name="search"
                placeholder="Search departments"
                defaultValue={first(raw.search)}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Entity
              </span>
              <select
                name="entityId"
                defaultValue={first(raw.entityId) ?? ""}
                className="admin-control h-9 border border-input bg-background px-2.5 text-sm"
              >
                <option value="">All entities</option>
                {entities.map((entity) => (
                  <option key={entity.id} value={entity.id}>
                    {entity.name}
                  </option>
                ))}
              </select>
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
          <DepartmentsTable result={paginatedDepartments} entities={entities} />
        </div>
      </div>
    </AdminPageShell>
  );
}
