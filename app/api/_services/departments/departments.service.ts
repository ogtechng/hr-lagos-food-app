import {
  createDepartment,
  deleteDepartment,
  getDepartmentById,
  getDepartmentBySlug,
  listActiveDepartments,
  listDepartments,
  listDepartmentsPaginated,
  updateDepartment,
} from "@/app/api/_repositories/departments/departments.repository";
import type {
  CreateDepartmentInput,
  DepartmentListQuery,
  UpdateDepartmentInput,
} from "@/app/api/_schemas/departments/department.schema";
import { slugify } from "@/lib/utils";

async function createUniqueDepartmentSlug(name: string, currentId?: string) {
  const baseSlug = slugify(name) || "department";
  let slug = baseSlug;
  let suffix = 2;

  while (true) {
    const existing = await getDepartmentBySlug(slug);
    if (!existing || existing.id === currentId) return slug;

    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export async function createDepartmentService(input: CreateDepartmentInput) {
  const slug = await createUniqueDepartmentSlug(input.name);
  return createDepartment({ ...input, slug });
}

export async function updateDepartmentService(id: string, input: UpdateDepartmentInput) {
  const slug = input.name ? await createUniqueDepartmentSlug(input.name, id) : undefined;
  return updateDepartment(id, { ...input, ...(slug ? { slug } : {}) });
}

export async function getDepartmentByIdService(id: string) {
  return getDepartmentById(id);
}

export async function listDepartmentsService() {
  return listDepartments();
}

export async function listActiveDepartmentsService() {
  return listActiveDepartments();
}

export async function listDepartmentsPaginatedService(query: DepartmentListQuery) {
  return listDepartmentsPaginated(query);
}

export async function deleteDepartmentService(id: string) {
  return deleteDepartment(id);
}
