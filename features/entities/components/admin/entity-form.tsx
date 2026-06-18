"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Entity } from "@/app/api/_db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEntityMutations } from "@/features/entities/hooks/use_entities_mutations";
import { cn } from "@/lib/utils";

interface EntityFormProps {
  entity?: Entity;
  className?: string;
}

function value(formData: FormData, key: string) {
  const item = formData.get(key);
  return typeof item === "string" ? item : "";
}

function entityInput(formData: FormData) {
  return {
    name: value(formData, "name"),
    slug: value(formData, "slug"),
    description: value(formData, "description") || null,
    logoUrl: value(formData, "logoUrl") || null,
    isActive: formData.get("isActive") === "on",
  };
}

export function EntityForm({ entity, className }: EntityFormProps) {
  const router = useRouter();
  const { create, update } = useEntityMutations();
  const pending = create.isPending || update.isPending;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = entityInput(new FormData(form));

    const onError = () => toast.error("Could not save the entity. Please try again.");

    if (entity) {
      update.mutate(
        { id: entity.id, input },
        {
          onSuccess: () => {
            toast.success("Entity updated");
            router.refresh();
          },
          onError,
        },
      );
    } else {
      create.mutate(input, {
        onSuccess: () => {
          toast.success("Entity created");
          form.reset();
          router.refresh();
        },
        onError,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold">Name</span>
          <Input name="name" defaultValue={entity?.name ?? ""} required className="bg-background" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold">Slug</span>
          <Input name="slug" defaultValue={entity?.slug ?? ""} required className="bg-background" />
        </label>
      </div>
      <label className="grid gap-2">
        <span className="text-sm font-semibold">Description</span>
        <Textarea
          name="description"
          defaultValue={entity?.description ?? ""}
          className="min-h-24 bg-background"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold">Logo URL</span>
        <Input name="logoUrl" defaultValue={entity?.logoUrl ?? ""} className="bg-background" />
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={entity?.isActive ?? true}
            className="size-4 rounded border-input accent-[#085b31]"
          />
          Active
        </label>
        <Button type="submit" disabled={pending} className="rounded-full px-4">
          {pending ? "Saving..." : entity ? "Update entity" : "Create entity"}
        </Button>
      </div>
    </form>
  );
}
