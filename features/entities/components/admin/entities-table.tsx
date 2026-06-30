"use client";

import type { Entity } from "@/app/api/_db/schema";
import type { PaginatedResult } from "@/app/api/_schemas/shared/list-query.schema";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { EntityActions } from "@/features/entities/components/admin/entity-actions";

interface EntitiesTableProps {
  result: PaginatedResult<Entity>;
}

export function EntitiesTable({ result }: EntitiesTableProps) {
  const columns: DataTableColumn<Entity>[] = [
    {
      id: "logo",
      header: "Logo",
      cell: ({ row }) => (
        <div className="grid size-9 place-items-center overflow-hidden rounded-md bg-neutral-100 text-xs font-semibold text-neutral-700">
          {row.original.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={row.original.logoUrl}
              alt=""
              className="size-full object-cover"
              loading="lazy"
            />
          ) : (
            row.original.name.slice(0, 2).toUpperCase()
          )}
        </div>
      ),
    },
    {
      id: "name",
      accessorKey: "name",
      header: "Entity",
      meta: { sortable: true },
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-xs text-muted-foreground">/{row.original.slug}</div>
        </div>
      ),
    },
    {
      id: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="line-clamp-2 text-sm text-muted-foreground">
          {row.original.description ?? "No description provided."}
        </span>
      ),
    },
    {
      id: "status",
      accessorKey: "isActive",
      header: "Status",
      meta: { sortable: true },
      cell: ({ row }) => <StatusBadge status={row.original.isActive ? "published" : "archived"} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <EntityActions entity={row.original} />,
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
      emptyTitle="No entities yet"
      emptyDescription="Create the first hiring entity."
      minWidth="980px"
    />
  );
}
