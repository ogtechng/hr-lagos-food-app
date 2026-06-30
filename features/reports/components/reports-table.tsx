"use client";

import type { PaginatedResult } from "@/app/api/_schemas/shared/list-query.schema";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import type { ApplicationsReportRow } from "@/features/reports/services/core_api";
import { formatDate } from "@/lib/utils";

interface ReportsTableProps {
  result: PaginatedResult<ApplicationsReportRow>;
}

export function ReportsTable({ result }: ReportsTableProps) {
  const columns: DataTableColumn<ApplicationsReportRow>[] = [
    {
      id: "applicantName",
      accessorKey: "applicantName",
      header: "Applicant",
      meta: { sortable: true },
      cell: ({ row }) => <span className="font-medium">{row.original.applicantName}</span>,
    },
    {
      id: "email",
      accessorKey: "applicantEmail",
      header: "Email",
      meta: { sortable: true },
    },
    {
      id: "phone",
      accessorKey: "applicantPhone",
      header: "Phone",
      meta: { sortable: true },
    },
    {
      id: "state",
      accessorKey: "applicantState",
      header: "State",
      meta: { sortable: true },
    },
    {
      id: "job",
      accessorKey: "jobTitle",
      header: "Job",
      meta: { sortable: true },
    },
    {
      id: "entity",
      accessorKey: "entityName",
      header: "Entity",
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
      id: "appliedAt",
      accessorKey: "appliedAt",
      header: "Application date",
      meta: { sortable: true },
      cell: ({ row }) => formatDate(row.original.appliedAt),
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
      emptyTitle="No report data"
      emptyDescription="No applications match the current report filters. Reset filters or widen the date range."
      minWidth="1020px"
    />
  );
}
