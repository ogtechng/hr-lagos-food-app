"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateJobInput, UpdateJobInput } from "@/app/api/_schemas/jobs/job.schema";
import { useApi } from "@/config/apiClient";
import { make_jobs_service } from "@/features/jobs/services";
import query_keys from "@/lib/query-keys";

/**
 * Job write operations as React Query mutations. Admin auth and Zod
 * validation are enforced by the `/api/v1/jobs` route handlers.
 */
export function useJobMutations() {
  const api = useApi();
  const service = make_jobs_service(api);
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: query_keys.jobs });

  const create = useMutation({
    mutationFn: (input: CreateJobInput) => service.create(input),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateJobInput }) => service.update(id, input),
    onSuccess: invalidate,
  });

  const publish = useMutation({
    mutationFn: (id: string) => service.publish(id),
    onSuccess: invalidate,
  });

  const close = useMutation({
    mutationFn: (id: string) => service.close(id),
    onSuccess: invalidate,
  });

  return { create, update, publish, close };
}
