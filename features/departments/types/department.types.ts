import type { Department } from "@/app/api/_db/schema";

export type AdminDepartment = Department & {
  entityName: string | null;
};
