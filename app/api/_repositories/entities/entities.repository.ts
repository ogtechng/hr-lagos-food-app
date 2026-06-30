import { and, asc, count, desc, eq, ilike, type SQL } from "drizzle-orm";

import { db } from "@/app/api/_db";
import { entities, type NewEntity } from "@/app/api/_db/schema";
import type { EntityListQuery, UpdateEntityInput } from "@/app/api/_schemas/entities/entity.schema";
import {
  createPaginatedResult,
  getOffset,
} from "@/app/api/_schemas/shared/list-query.schema";

function buildEntityFilters(query: EntityListQuery) {
  const conditions: SQL[] = [];

  if (query.search) conditions.push(ilike(entities.name, `%${query.search}%`));
  if (query.status === "active") conditions.push(eq(entities.isActive, true));
  if (query.status === "inactive") conditions.push(eq(entities.isActive, false));

  return conditions.length > 0 ? and(...conditions) : undefined;
}

function entityOrderBy(query: EntityListQuery) {
  const direction = query.sortDir === "desc" ? desc : asc;

  if (query.sortBy === "createdAt") return direction(entities.createdAt);
  if (query.sortBy === "status") return direction(entities.isActive);
  return direction(entities.name);
}

export async function createEntity(data: NewEntity) {
  const [entity] = await db.insert(entities).values(data).returning();
  return entity;
}

export async function updateEntity(id: string, data: UpdateEntityInput) {
  const [entity] = await db
    .update(entities)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(entities.id, id))
    .returning();

  return entity ?? null;
}

export async function getEntityById(id: string) {
  const [entity] = await db.select().from(entities).where(eq(entities.id, id)).limit(1);
  return entity ?? null;
}

export async function getEntityBySlug(slug: string) {
  const [entity] = await db.select().from(entities).where(eq(entities.slug, slug)).limit(1);
  return entity ?? null;
}

export async function listEntities() {
  return db.select().from(entities).orderBy(asc(entities.name));
}

export async function listEntitiesPaginated(query: EntityListQuery) {
  const where = buildEntityFilters(query);
  const [{ total }] = await db.select({ total: count() }).from(entities).where(where);
  const rows = await db
    .select()
    .from(entities)
    .where(where)
    .orderBy(entityOrderBy(query))
    .limit(query.pageSize)
    .offset(getOffset(query));

  return createPaginatedResult(rows, total, query);
}

export async function listActiveEntities() {
  return db.select().from(entities).where(eq(entities.isActive, true)).orderBy(asc(entities.name));
}

export async function deactivateEntity(id: string) {
  return updateEntity(id, { isActive: false });
}

export async function activateEntity(id: string) {
  return updateEntity(id, { isActive: true });
}

export async function deleteEntity(id: string) {
  const [entity] = await db.delete(entities).where(eq(entities.id, id)).returning();
  return entity ?? null;
}
