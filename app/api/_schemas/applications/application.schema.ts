import { z } from "zod";

import { listQuerySchema } from "@/app/api/_schemas/shared/list-query.schema";

export const applicationStatusSchema = z.enum(["submitted", "accepted", "rejected"]);

export const applicationIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const createApplicationSchema = z.object({
  jobId: z.string().uuid(),
  name: z.string().trim().min(2).max(255),
  phone: z.string().trim().min(5).max(50),
  email: z.string().trim().email().max(255),
  state: z.string().trim().min(1).max(120),
  address: z.string().trim().min(1),
  cvUrl: z.string().trim().url(),
  cvFileName: z.string().trim().max(255).optional().nullable(),
  cvStoragePath: z.string().trim().optional().nullable(),
  coverLetterUrl: z.string().trim().url().optional().nullable(),
  coverLetterFileName: z.string().trim().max(255).optional().nullable(),
  coverLetterStoragePath: z.string().trim().optional().nullable(),
});

export const publicApplicationFormSchema = z.object({
  jobId: z.string().uuid(),
  name: z.string().trim().min(1, "Name is required").max(255),
  phone: z.string().trim().min(1, "Phone is required").max(50),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email").max(255),
  state: z.string().trim().min(1, "State is required").max(120),
  address: z.string().trim().min(1, "Address is required"),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(["accepted", "rejected"]),
  note: z.string().trim().optional().nullable(),
  changedBy: z.string().trim().max(255).optional().nullable(),
});

export const applicationFiltersSchema = z.object({
  jobId: z.string().uuid().optional(),
  entityId: z.string().uuid().optional(),
  status: applicationStatusSchema.optional(),
  email: z.string().trim().email().optional(),
  search: z.string().trim().max(255).optional(),
  createdFrom: z.coerce.date().optional(),
  createdTo: z.coerce.date().optional(),
});

export const adminApplicationListQuerySchema = applicationFiltersSchema.merge(
  listQuerySchema.extend({
    sortBy: z.enum(["name", "job", "entity", "status", "createdAt"]).catch("createdAt"),
  }),
);

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type PublicApplicationFormInput = z.infer<typeof publicApplicationFormSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
export type ApplicationFilters = z.infer<typeof applicationFiltersSchema>;
export type AdminApplicationListQuery = z.infer<typeof adminApplicationListQuerySchema>;
