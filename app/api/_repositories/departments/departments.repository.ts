import { and, asc, count, desc, eq, ilike, type SQL } from "drizzle-orm";

import { db } from "@/app/api/_db";
import { departments, entities, type NewDepartment } from "@/app/api/_db/schema";
import {
  createPaginatedResult,
  getOffset,
} from "@/app/api/_schemas/shared/list-query.schema";
import type {
  DepartmentListQuery,
  UpdateDepartmentInput,
} from "@/app/api/_schemas/departments/department.schema";

function buildDepartmentFilters(query: DepartmentListQuery) {
  const conditions: SQL[] = [];

  if (query.search) conditions.push(ilike(departments.name, `%${query.search}%`));
  if (query.entityId) conditions.push(eq(departments.entityId, query.entityId));
  if (query.status === "active") conditions.push(eq(departments.isActive, true));
  if (query.status === "inactive") conditions.push(eq(departments.isActive, false));

  return conditions.length > 0 ? and(...conditions) : undefined;
}

function departmentOrderBy(query: DepartmentListQuery) {
  const direction = query.sortDir === "desc" ? desc : asc;

  if (query.sortBy === "createdAt") return direction(departments.createdAt);
  if (query.sortBy === "entity") return direction(entities.name);
  if (query.sortBy === "status") return direction(departments.isActive);
  return direction(departments.name);
}

export async function createDepartment(data: NewDepartment) {
  const [department] = await db.insert(departments).values(data).returning();
  return department;
}

export async function updateDepartment(id: string, data: UpdateDepartmentInput) {
  const [department] = await db
    .update(departments)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(departments.id, id))
    .returning();

  return department ?? null;
}

export async function getDepartmentById(id: string) {
  const [department] = await db.select().from(departments).where(eq(departments.id, id)).limit(1);
  return department ?? null;
}

export async function getDepartmentBySlug(slug: string) {
  const [department] = await db
    .select()
    .from(departments)
    .where(eq(departments.slug, slug))
    .limit(1);
  return department ?? null;
}

export async function listDepartments() {
  return db
    .select({
      id: departments.id,
      entityId: departments.entityId,
      entityName: entities.name,
      name: departments.name,
      slug: departments.slug,
      isActive: departments.isActive,
      createdAt: departments.createdAt,
      updatedAt: departments.updatedAt,
    })
    .from(departments)
    .leftJoin(entities, eq(departments.entityId, entities.id))
    .orderBy(asc(departments.name));
}

export async function listActiveDepartments() {
  return db
    .select({
      id: departments.id,
      entityId: departments.entityId,
      entityName: entities.name,
      name: departments.name,
      slug: departments.slug,
      isActive: departments.isActive,
      createdAt: departments.createdAt,
      updatedAt: departments.updatedAt,
    })
    .from(departments)
    .leftJoin(entities, eq(departments.entityId, entities.id))
    .where(eq(departments.isActive, true))
    .orderBy(asc(departments.name));
}

export async function listDepartmentsPaginated(query: DepartmentListQuery) {
  const where = buildDepartmentFilters(query);
  const [{ total }] = await db
    .select({ total: count() })
    .from(departments)
    .leftJoin(entities, eq(departments.entityId, entities.id))
    .where(where);
  const rows = await db
    .select({
      id: departments.id,
      entityId: departments.entityId,
      entityName: entities.name,
      name: departments.name,
      slug: departments.slug,
      isActive: departments.isActive,
      createdAt: departments.createdAt,
      updatedAt: departments.updatedAt,
    })
    .from(departments)
    .leftJoin(entities, eq(departments.entityId, entities.id))
    .where(where)
    .orderBy(departmentOrderBy(query))
    .limit(query.pageSize)
    .offset(getOffset(query));

  return createPaginatedResult(rows, total, query);
}

export async function deleteDepartment(id: string) {
  const [department] = await db.delete(departments).where(eq(departments.id, id)).returning();
  return department ?? null;
}
