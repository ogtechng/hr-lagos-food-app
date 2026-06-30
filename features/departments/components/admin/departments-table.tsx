"use client";

import type { Entity } from "@/app/api/_db/schema";
import type { PaginatedResult } from "@/app/api/_schemas/shared/list-query.schema";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { DepartmentActions } from "@/features/departments/components/admin/department-actions";
import type { AdminDepartment } from "@/features/departments/types/department.types";
import { formatDate } from "@/lib/utils";

interface DepartmentsTableProps {
  result: PaginatedResult<AdminDepartment>;
  entities: Entity[];
}

export function DepartmentsTable({ result, entities }: DepartmentsTableProps) {
  const columns: DataTableColumn<AdminDepartment>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: "Department",
      meta: { sortable: true },
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-xs text-muted-foreground">/{row.original.slug}</div>
        </div>
      ),
    },
    {
      id: "entity",
      accessorKey: "entityName",
      header: "Entity",
      meta: { sortable: true },
      cell: ({ row }) => row.original.entityName ?? "Unassigned",
    },
    {
      id: "status",
      accessorKey: "isActive",
      header: "Status",
      meta: { sortable: true },
      cell: ({ row }) => <StatusBadge status={row.original.isActive ? "published" : "archived"} />,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: "Created",
      meta: { sortable: true },
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <DepartmentActions department={row.original} entities={entities} />,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={result.rows}
      page={result.page}
      pageSize={result.pageSize}
      total={result.total}
      pageCount={result.pageCount}
      emptyTitle="No departments yet"
      emptyDescription="Create a department before assigning it to job submissions."
      minWidth="820px"
    />
  );
}
