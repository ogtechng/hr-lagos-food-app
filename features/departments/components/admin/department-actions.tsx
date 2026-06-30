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
import { DepartmentForm } from "@/features/departments/components/admin/department-form";
import { useDepartmentsMutations } from "@/features/departments/hooks/use_departments_mutations";
import type { AdminDepartment } from "@/features/departments/types/department.types";

interface DepartmentActionsProps {
  department: AdminDepartment;
  entities: Entity[];
}

export function DepartmentActions({ department, entities }: DepartmentActionsProps) {
  const router = useRouter();
  const { update, delete: deleteDepartment } = useDepartmentsMutations();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const pending = update.isPending || deleteDepartment.isPending;

  function setActive(isActive: boolean) {
    update.mutate(
      { id: department.id, input: { isActive } },
      {
        onSuccess: () => {
          toast.success(isActive ? "Department activated" : "Department deactivated");
          router.refresh();
        },
        onError: () => toast.error("Could not update department"),
      },
    );
  }

  function remove() {
    deleteDepartment.mutate(department.id, {
      onSuccess: () => {
        toast.success("Department deleted");
        router.refresh();
      },
      onError: () => toast.error("Could not delete department"),
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
            <DropdownMenuItem
              disabled={pending}
              onClick={() => setActive(!department.isActive)}
            >
              <Power className="size-4" aria-hidden="true" />
              {department.isActive ? "Deactivate" : "Activate"}
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
            <SheetTitle>Edit department</SheetTitle>
            <SheetDescription>
              Update the department and entity pairing used when creating jobs.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-4">
            <DepartmentForm department={department} entities={entities} />
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {department.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Jobs keep their saved department text, but this department option will be removed from
              future job setup.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" disabled={pending} onClick={remove}>
              {deleteDepartment.isPending ? "Deleting..." : "Delete department"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
