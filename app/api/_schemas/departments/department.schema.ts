import { z } from "zod";

import { listQuerySchema } from "@/app/api/_schemas/shared/list-query.schema";

export const departmentIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const createDepartmentSchema = z.object({
  entityId: z.string().uuid(),
  name: z.string().trim().min(1).max(255),
  isActive: z.boolean().optional(),
});

export const updateDepartmentSchema = createDepartmentSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const departmentListQuerySchema = listQuerySchema.extend({
  entityId: z.string().uuid().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  sortBy: z.enum(["name", "entity", "status", "createdAt"]).catch("name"),
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
export type DepartmentListQuery = z.infer<typeof departmentListQuerySchema>;
