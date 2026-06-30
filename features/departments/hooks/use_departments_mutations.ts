"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from "@/app/api/_schemas/departments/department.schema";
import { useApi } from "@/config/apiClient";
import { make_departments_service } from "@/features/departments/services";

export function useDepartmentsMutations() {
  const api = useApi();
  const queryClient = useQueryClient();
  const service = make_departments_service(api);
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["departments"] });

  return {
    create: useMutation({
      mutationFn: (input: CreateDepartmentInput) => service.create(input),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, input }: { id: string; input: UpdateDepartmentInput }) =>
        service.update(id, input),
      onSuccess: invalidate,
    }),
    delete: useMutation({
      mutationFn: (id: string) => service.delete(id),
      onSuccess: invalidate,
    }),
  };
}
