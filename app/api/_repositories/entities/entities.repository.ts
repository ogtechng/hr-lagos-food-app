import { asc, eq } from "drizzle-orm";

import { db } from "@/app/api/_db";
import { entities, type NewEntity } from "@/app/api/_db/schema";
import type { UpdateEntityInput } from "@/app/api/_schemas/entities/entity.schema";

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
