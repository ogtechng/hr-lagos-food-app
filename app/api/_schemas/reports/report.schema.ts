import { z } from "zod";

import { listQuerySchema } from "@/app/api/_schemas/shared/list-query.schema";

export const reportFiltersSchema = z.object({
  entityId: z.string().uuid().optional(),
  jobId: z.string().uuid().optional(),
  status: z.enum(["submitted", "accepted", "rejected"]).optional(),
  createdFrom: z.coerce.date().optional(),
  createdTo: z.coerce.date().optional(),
  search: z.string().trim().max(255).optional(),
});

export const reportListQuerySchema = reportFiltersSchema.merge(
  listQuerySchema.extend({
    sortBy: z
      .enum(["applicantName", "email", "phone", "state", "job", "entity", "status", "appliedAt"])
      .catch("appliedAt"),
  }),
);

const queryValueSchema = z
  .union([z.string(), z.array(z.string()), z.undefined()])
  .transform((value) => {
    const rawValue = Array.isArray(value) ? value[0] : value;
    const trimmedValue = rawValue?.trim();
    return trimmedValue ? trimmedValue : undefined;
  });

export const reportQuerySchema = z
  .object({
    dateFrom: queryValueSchema.optional(),
    dateTo: queryValueSchema.optional(),
    entity: queryValueSchema.optional(),
    job: queryValueSchema.optional(),
    status: queryValueSchema.optional(),
    search: queryValueSchema.optional(),
  })
  .transform((input) =>
    reportFiltersSchema.parse({
      entityId: input.entity,
      jobId: input.job,
      status: input.status,
      search: input.search,
      createdFrom: input.dateFrom,
      createdTo: input.dateTo,
    }),
  );

export type ReportFilters = z.infer<typeof reportFiltersSchema>;
export type ReportListQuery = z.infer<typeof reportListQuerySchema>;
export type ReportQuery = z.infer<typeof reportQuerySchema>;
