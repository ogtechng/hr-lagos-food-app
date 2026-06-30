"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Power, Trash2 } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { EntityForm } from "@/features/entities/components/admin/entity-form";
import { useEntityMutations } from "@/features/entities/hooks/use_entities_mutations";

interface EntityActionsProps {
  entity: Entity;
}

export function EntityActions({ entity }: EntityActionsProps) {
  const router = useRouter();
  const { activate, deactivate, deleteEntity } = useEntityMutations();
  const pending = activate.isPending || deactivate.isPending || deleteEntity.isPending;
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

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
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-w-28 justify-between border-neutral-200 bg-neutral-50 text-neutral-800 hover:bg-neutral-100"
            />
          }
        >
          Actions
          <MoreHorizontal className="size-4" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setSheetOpen(true)}>
              <Pencil className="size-4" aria-hidden="true" />
              Edit details
            </DropdownMenuItem>
            <DropdownMenuItem disabled={pending} onClick={handleToggle}>
              <Power className="size-4" aria-hidden="true" />
              {entity.isActive ? "Deactivate" : "Activate"}
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              disabled={pending}
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Edit entity</SheetTitle>
            <SheetDescription>
              Update the entity details used across the admin hiring workflow.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-4">
            <EntityForm entity={entity} />
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
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
    </>
  );
}
