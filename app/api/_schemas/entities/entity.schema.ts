import { z } from "zod";

import { listQuerySchema } from "@/app/api/_schemas/shared/list-query.schema";

export const entityIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const entitySlugParamSchema = z.object({
  slug: z.string().trim().min(1).max(255),
});

export const createEntitySchema = z.object({
  name: z.string().trim().min(1).max(255),
  description: z.string().trim().optional().nullable(),
  logoUrl: z.string().url().optional().nullable(),
  isActive: z.boolean().optional(),
});

export const updateEntitySchema = createEntitySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const entityListQuerySchema = listQuerySchema.extend({
  status: z.enum(["active", "inactive"]).optional(),
  sortBy: z.enum(["name", "status", "createdAt"]).catch("name"),
});

export type CreateEntityInput = z.infer<typeof createEntitySchema>;
export type UpdateEntityInput = z.infer<typeof updateEntitySchema>;
export type EntityListQuery = z.infer<typeof entityListQuerySchema>;
