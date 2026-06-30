"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EntityForm } from "@/features/entities/components/admin/entity-form";

export function CreateEntityDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-[var(--admin-lemon)] text-[var(--admin-primary)] hover:bg-[var(--admin-lemon)]/80">
            <Plus className="size-4" aria-hidden="true" />
            Create entity
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg! overflow-hidden">
        <DialogHeader>
          <DialogTitle>Create entity</DialogTitle>
          <DialogDescription>
            Add a business unit, brand, or operation that can own jobs.
          </DialogDescription>
        </DialogHeader>
        <EntityForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
