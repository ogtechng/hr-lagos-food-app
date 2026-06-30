"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Entity } from "@/app/api/_db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDepartmentsMutations } from "@/features/departments/hooks/use_departments_mutations";
import type { AdminDepartment } from "@/features/departments/types/department.types";

interface DepartmentFormProps {
  entities: Entity[];
  department?: AdminDepartment;
}

function value(formData: FormData, key: string) {
  const item = formData.get(key);
  return typeof item === "string" ? item : "";
}

export function DepartmentForm({ department, entities }: DepartmentFormProps) {
  const router = useRouter();
  const { create, update } = useDepartmentsMutations();
  const pending = create.isPending || update.isPending;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const input = {
      entityId: value(formData, "entityId"),
      name: value(formData, "name"),
      isActive: formData.get("isActive") === "on",
    };

    const onSuccess = () => {
      toast.success(department ? "Department updated" : "Department created");
      router.refresh();
      if (!department) form.reset();
    };
    const onError = () => toast.error("Could not save the department. Please try again.");

    if (department) {
      update.mutate({ id: department.id, input }, { onSuccess, onError });
    } else {
      create.mutate(input, { onSuccess, onError });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="grid gap-2">
        <span className="text-sm font-semibold">Entity</span>
        <select
          name="entityId"
          defaultValue={department?.entityId ?? ""}
          required
          className="admin-control h-10 w-full border border-input bg-background px-3.5 text-sm"
        >
          <option value="">Select entity</option>
          {entities.map((entity) => (
            <option key={entity.id} value={entity.id}>
              {entity.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold">Name</span>
        <Input name="name" defaultValue={department?.name ?? ""} required />
      </label>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={department?.isActive ?? true}
          className="size-4 rounded border-input"
        />
        Active
      </label>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : department ? "Update department" : "Create department"}
      </Button>
    </form>
  );
}
