import {
  activateEntity,
  createEntity,
  deactivateEntity,
  deleteEntity,
  getEntityById,
  getEntityBySlug,
  listActiveEntities,
  listEntities,
  updateEntity,
} from "@/app/api/_repositories/entities/entities.repository";
import type {
  CreateEntityInput,
  UpdateEntityInput,
} from "@/app/api/_schemas/entities/entity.schema";

export async function createEntityService(input: CreateEntityInput) {
  return createEntity(input);
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
