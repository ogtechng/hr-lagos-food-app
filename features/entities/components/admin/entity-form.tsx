"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import type { Entity } from "@/app/api/_db/schema";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEntityMutations } from "@/features/entities/hooks/use_entities_mutations";
import { cn } from "@/lib/utils";

interface EntityFormProps {
  entity?: Entity;
  className?: string;
  onSuccess?: () => void;
}

function value(formData: FormData, key: string) {
  const item = formData.get(key);
  return typeof item === "string" ? item : "";
}

function entityInput(formData: FormData) {
  return {
    name: value(formData, "name"),
    description: value(formData, "description") || null,
    logoUrl: value(formData, "logoUrl") || null,
    isActive: formData.get("isActive") === "on",
  };
}

async function uploadPendingLogo(formData: FormData) {
  const file = formData.get("logoUrlFile");

  if (!(file instanceof File) || file.size === 0) {
    return value(formData, "logoUrl") || null;
  }

  const uploadData = new FormData();
  uploadData.append("image", file);
  uploadData.append("folder", "entities");

  const response = await fetch("/api/v1/uploads/editor-images", {
    method: "POST",
    body: uploadData,
  });
  const payload = (await response.json()) as { data?: { url: string }; error?: string };

  if (!response.ok || !payload.data?.url) {
    throw new Error(payload.error ?? "Image upload failed");
  }

  return payload.data.url;
}

export function EntityForm({ entity, className }: EntityFormProps) {
  const router = useRouter();
  const { create, update } = useEntityMutations();
  const [uploading, setUploading] = useState(false);
  const pending = create.isPending || update.isPending || uploading;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const input = entityInput(formData);

    const onError = () => toast.error("Could not save the entity. Please try again.");

    setUploading(true);
    void uploadPendingLogo(formData)
      .then((logoUrl) => {
        const payload = { ...input, logoUrl };

        if (entity) {
          update.mutate(
            { id: entity.id, input: payload },
            {
              onSuccess: () => {
                toast.success("Entity updated");
                router.refresh();
              },
              onError,
            },
          );
        } else {
          create.mutate(payload, {
            onSuccess: () => {
              toast.success("Entity created");
              form.reset();
              router.refresh();
            },
            onError,
          });
        }
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Image upload failed");
      })
      .finally(() => {
        setUploading(false);
      });
  }

  return (
    <form onSubmit={handleSubmit} className={cn("w-118 space-y-4", className)}>
      <label className="grid gap-2">
        <span className="text-sm font-semibold">Name</span>
        <Input name="name" defaultValue={entity?.name ?? ""} required className="bg-background" />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold">Description</span>
        <Textarea
          name="description"
          defaultValue={entity?.description ?? ""}
          className="min-h-24 bg-background"
        />
      </label>
      <ImageUploadField
        name="logoUrl"
        label="Logo"
        defaultValue={entity?.logoUrl}
        helper="Upload the entity logo as PNG, JPG, WebP, or GIF."
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={entity?.isActive ?? true}
            className="size-4 rounded border-input accent-[var(--admin-primary)]"
          />
          Active
        </label>
        <Button type="submit" disabled={pending} className="px-4">
          {pending ? "Saving..." : entity ? "Update entity" : "Create entity"}
        </Button>
      </div>
    </form>
  );
}
