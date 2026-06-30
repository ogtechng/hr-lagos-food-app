import { z } from "zod";

import { listQuerySchema } from "@/app/api/_schemas/shared/list-query.schema";

export const jobStatusSchema = z.enum(["draft", "published", "closed"]);

export const jobIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const jobSlugParamSchema = z.object({
  slug: z.string().trim().min(1).max(255),
});

export const createJobSchema = z.object({
  entityId: z.string().uuid(),
  title: z.string().trim().min(1).max(255),
  department: z.string().trim().max(255).optional().nullable(),
  location: z.string().trim().min(1).max(255),
  employmentType: z.string().trim().max(100).optional().nullable(),
  description: z.string().trim().optional().nullable(),
  responsibilities: z.string().trim().optional().nullable(),
  requirements: z.string().trim().optional().nullable(),
  status: jobStatusSchema.optional(),
});

export const updateJobSchema = createJobSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const jobFiltersSchema = z.object({
  entityId: z.string().uuid().optional(),
  entitySlug: z.string().trim().min(1).max(255).optional(),
  status: jobStatusSchema.optional(),
  department: z.string().trim().max(255).optional(),
  location: z.string().trim().max(255).optional(),
  employmentType: z.string().trim().max(100).optional(),
  search: z.string().trim().max(255).optional(),
});

export const adminJobListQuerySchema = jobFiltersSchema.merge(
  listQuerySchema.extend({
    sortBy: z
      .enum(["title", "entity", "department", "location", "status", "createdAt"])
      .catch("createdAt"),
  }),
);

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type JobFilters = z.infer<typeof jobFiltersSchema>;
export type AdminJobListQuery = z.infer<typeof adminJobListQuerySchema>;
