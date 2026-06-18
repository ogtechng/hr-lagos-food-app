"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Entity } from "@/app/api/_db/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useEntityMutations } from "@/features/entities/hooks/use_entities_mutations";

interface EntityActionsProps {
  entity: Entity;
}

export function EntityActions({ entity }: EntityActionsProps) {
  const router = useRouter();
  const { activate, deactivate, deleteEntity } = useEntityMutations();
  const pending = activate.isPending || deactivate.isPending || deleteEntity.isPending;

  function handleToggle() {
    const mutation = entity.isActive ? deactivate : activate;
    mutation.mutate(entity.id, {
      onSuccess: () => {
        toast.success(entity.isActive ? "Entity deactivated" : "Entity activated");
        router.refresh();
      },
      onError: () => toast.error("Action failed. Please try again."),
    });
  }

  function handleDelete() {
    deleteEntity.mutate(entity.id, {
      onSuccess: () => {
        toast.success("Entity deleted");
        router.refresh();
      },
      onError: () =>
        toast.error("Could not delete this entity. Remove or reassign linked jobs first."),
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="outline" size="sm" disabled={pending} onClick={handleToggle}>
        {entity.isActive ? "Deactivate" : "Activate"}
      </Button>

      <AlertDialog>
        <AlertDialogTrigger render={<Button type="button" variant="destructive" size="sm" />}>
          Delete
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {entity.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the entity. If it has jobs or applications linked to it, the
              delete will be blocked until those records are reassigned or removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" disabled={pending} onClick={handleDelete}>
              {deleteEntity.isPending ? "Deleting..." : "Delete entity"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
