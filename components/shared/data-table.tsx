"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type DataTableColumn<T> = ColumnDef<T> & {
  meta?: {
    header?: string;
    className?: string;
    sortable?: boolean;
  };
};

function getColumnMeta<T>(column: ColumnDef<T>) {
  return column.meta as DataTableColumn<T>["meta"] | undefined;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  page?: number;
  pageSize?: number;
  total?: number;
  pageCount?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  minWidth?: string;
}

export function DataTable<T>({
  columns,
  data,
  page = 1,
  pageSize = data.length,
  total = data.length,
  pageCount = 1,
  emptyTitle = "No data found",
  emptyDescription,
  minWidth = "760px",
}: DataTableProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  function sortColumn(id: string) {
    const currentSortBy = searchParams.get("sortBy");
    const currentSortDir = searchParams.get("sortDir") ?? "desc";
    const nextSortDir = currentSortBy === id && currentSortDir === "asc" ? "desc" : "asc";
    updateParams({ sortBy: id, sortDir: nextSortDir, page: "1" });
  }

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  const firstRow = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastRow = Math.min(total, page * pageSize);

  return (
    <div className="space-y-3">
      <div className="admin-table-shell overflow-x-auto rounded-lg">
        <Table style={{ minWidth }}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = getColumnMeta(header.column.columnDef);
                  const sortable = meta?.sortable;
                  const active = searchParams.get("sortBy") === header.column.id;
                  const dir = searchParams.get("sortDir") ?? "desc";
                  const Icon = active ? (dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;

                  return (
                    <TableHead
                      key={header.id}
                      className={cn(meta?.className)}
                    >
                      {sortable ? (
                        <button
                          type="button"
                          onClick={() => sortColumn(header.column.id)}
                          className="inline-flex items-center gap-1.5 text-left font-semibold"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <Icon className="size-3.5" aria-hidden="true" />
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={getColumnMeta(cell.column.columnDef)?.className}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="admin-table-shell flex flex-col gap-3 rounded-lg p-3 text-sm text-[var(--admin-muted)] md:flex-row md:items-center md:justify-between">
        <span>
          Showing {firstRow}-{lastRow} of {total}
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => updateParams({ page: String(page - 1) })}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            Previous
          </Button>
          <span className="px-2">
            Page {page} of {pageCount}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= pageCount}
            onClick={() => updateParams({ page: String(page + 1) })}
          >
            Next
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
