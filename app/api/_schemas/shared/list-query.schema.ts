import { z } from "zod";

export const sortDirectionSchema = z.enum(["asc", "desc"]);

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  pageSize: z.coerce.number().int().min(1).max(100).catch(10),
});

export const listQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().max(255).optional(),
  sortBy: z.string().trim().max(80).optional(),
  sortDir: sortDirectionSchema.catch("desc"),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type ListQuery = z.infer<typeof listQuerySchema>;

export type PaginatedResult<T> = {
  rows: T[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};

export function createPaginatedResult<T>(rows: T[], total: number, query: PaginationQuery) {
  return {
    rows,
    page: query.page,
    pageSize: query.pageSize,
    total,
    pageCount: Math.max(1, Math.ceil(total / query.pageSize)),
  } satisfies PaginatedResult<T>;
}

export function getOffset(query: PaginationQuery) {
  return (query.page - 1) * query.pageSize;
}
