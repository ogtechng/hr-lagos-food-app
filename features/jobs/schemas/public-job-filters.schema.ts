import { z } from "zod";

const queryValueSchema = z
  .union([z.string(), z.array(z.string()), z.undefined()])
  .transform((value) => {
    const rawValue = Array.isArray(value) ? value[0] : value;
    const trimmedValue = rawValue?.trim();
    return trimmedValue ? trimmedValue : undefined;
  });

export const publicJobFiltersSchema = z.object({
  q: queryValueSchema.optional(),
  entity: queryValueSchema.optional(),
  location: queryValueSchema.optional(),
  employmentType: queryValueSchema.optional(),
});

export type PublicJobFilters = z.infer<typeof publicJobFiltersSchema>;
