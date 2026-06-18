"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateApplicationStatusInput } from "@/app/api/_schemas/applications/application.schema";
import { useApi } from "@/config/apiClient";
import { make_applications_service } from "@/features/applications/services";
import query_keys from "@/lib/query-keys";

/**
 * Application write operations as React Query mutations.
 *
 * `create` is public (the `/api/v1/applications` POST handler validates input
 * and handles the CV upload); `updateStatus` and `updateNote` hit admin-gated
 * routes that enforce `requireAdmin()`.
 */
export function useApplicationMutations() {
  const api = useApi();
  const service = make_applications_service(api);
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: query_keys.applications });

  const create = useMutation({
    mutationFn: (formData: FormData) => service.create_public(formData),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateApplicationStatusInput }) =>
      service.update_status(id, input),
    onSuccess: invalidate,
  });

  const updateNote = useMutation({
    mutationFn: ({ id, adminNote }: { id: string; adminNote: string | null }) =>
      service.update_admin_note(id, adminNote),
    onSuccess: invalidate,
  });

  return { create, updateStatus, updateNote };
}
