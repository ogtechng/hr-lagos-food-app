"use client";

import Link from "next/link";
import { Eye, MoreHorizontal } from "lucide-react";

import type { PaginatedResult } from "@/app/api/_schemas/shared/list-query.schema";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminApplicationListItem } from "@/features/applications/services/core_api";
import { formatDate } from "@/lib/utils";

interface ApplicationsTableProps {
  result: PaginatedResult<AdminApplicationListItem>;
}

export function ApplicationsTable({ result }: ApplicationsTableProps) {
  const columns: DataTableColumn<AdminApplicationListItem>[] = [
    {
      id: "avatar",
      header: "",
      cell: ({ row }) => (
        <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.dicebear.com/10.x/glyphs/svg?seed=${encodeURIComponent(row.original.name)}`}
            alt=""
            className="size-full"
          />
        </span>
      ),
    },
    {
      id: "name",
      header: "Applicant",
      meta: { sortable: true },
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.email} · {row.original.phone}
          </div>
        </div>
      ),
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
      id: "createdAt",
      accessorKey: "createdAt",
      header: "Applied",
      meta: { sortable: true },
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="min-w-28 justify-between border-neutral-200 bg-neutral-50 text-neutral-800 hover:bg-neutral-100"
              />
            }
          >
            Actions
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href={`/admin/applications/${row.original.id}`} />}>
                <Eye className="size-4" aria-hidden="true" />
                View application
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
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
      emptyTitle="No applications found"
      emptyDescription="Try a different filter range, or check back after applicants submit."
      minWidth="920px"
    />
  );
}
