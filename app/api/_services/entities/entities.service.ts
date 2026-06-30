import {
  activateEntity,
  createEntity,
  deactivateEntity,
  deleteEntity,
  getEntityById,
  getEntityBySlug,
  listActiveEntities,
  listEntities,
  listEntitiesPaginated,
  updateEntity,
} from "@/app/api/_repositories/entities/entities.repository";
import type {
  CreateEntityInput,
  EntityListQuery,
  UpdateEntityInput,
} from "@/app/api/_schemas/entities/entity.schema";
import { slugify } from "@/lib/utils";

export async function createEntityService(input: CreateEntityInput) {
  return createEntity({
    ...input,
    slug: await createUniqueEntitySlug(input.name),
  });
}

export async function updateEntityService(id: string, input: UpdateEntityInput) {
  return updateEntity(id, input);
}

export async function getEntityByIdService(id: string) {
  return getEntityById(id);
}

export async function getEntityBySlugService(slug: string) {
  return getEntityBySlug(slug);
}

export async function listEntitiesService() {
  return listEntities();
}

export async function listEntitiesPaginatedService(query: EntityListQuery) {
  return listEntitiesPaginated(query);
}

export async function listActiveEntitiesService() {
  return listActiveEntities();
}

export async function deactivateEntityService(id: string) {
  return deactivateEntity(id);
}

export async function activateEntityService(id: string) {
  return activateEntity(id);
}

export async function deleteEntityService(id: string) {
  return deleteEntity(id);
}

async function createUniqueEntitySlug(name: string) {
  const baseSlug = slugify(name) || "entity";
  let slug = baseSlug;
  let suffix = 2;

  while (await getEntityBySlug(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}
