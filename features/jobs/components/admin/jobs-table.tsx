"use client";

import type { PaginatedResult } from "@/app/api/_schemas/shared/list-query.schema";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { JobAdminActions } from "@/features/jobs/components/admin/job-admin-actions";
import type { AdminJob } from "@/features/jobs/services/core_api";

interface JobsTableProps {
  result: PaginatedResult<AdminJob>;
}

export function JobsTable({ result }: JobsTableProps) {
  const columns: DataTableColumn<AdminJob>[] = [
    {
      id: "title",
      accessorKey: "title",
      header: "Job",
      meta: { sortable: true },
      cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
    },
    {
      id: "entity",
      accessorKey: "entityName",
      header: "Entity",
      meta: { sortable: true },
    },
    {
      id: "department",
      accessorKey: "department",
      header: "Department",
      meta: { sortable: true },
      cell: ({ row }) => row.original.department ?? "Not set",
    },
    {
      id: "location",
      accessorKey: "location",
      header: "Location",
      meta: { sortable: true },
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      meta: { sortable: true },
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <JobAdminActions id={row.original.id} status={row.original.status as never} />
      ),
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
      emptyTitle="No jobs found"
      emptyDescription="Adjust the filters or create a new role when hiring opens."
      minWidth="900px"
    />
  );
}
