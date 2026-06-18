"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  CreateEntityInput,
  UpdateEntityInput,
} from "@/app/api/_schemas/entities/entity.schema";
import { useApi } from "@/config/apiClient";
import { make_entities_service } from "@/features/entities/services";
import query_keys from "@/lib/query-keys";

/**
 * Entity write operations as React Query mutations. Admin auth and Zod
 * validation are enforced by the `/api/v1/entities` route handlers.
 */
export function useEntityMutations() {
  const api = useApi();
  const service = make_entities_service(api);
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: query_keys.entities });

  const create = useMutation({
    mutationFn: (input: CreateEntityInput) => service.create(input),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateEntityInput }) =>
      service.update(id, input),
    onSuccess: invalidate,
  });

  const activate = useMutation({
    mutationFn: (id: string) => service.activate(id),
    onSuccess: invalidate,
  });

  const deactivate = useMutation({
    mutationFn: (id: string) => service.deactivate(id),
    onSuccess: invalidate,
  });

  const deleteEntity = useMutation({
    mutationFn: (id: string) => service.delete(id),
    onSuccess: invalidate,
  });

  return { create, update, activate, deactivate, deleteEntity };
}
