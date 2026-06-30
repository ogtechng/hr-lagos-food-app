"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, LockKeyhole, MoreHorizontal, Pencil } from "lucide-react";
import { toast } from "sonner";

import type { JobStatus } from "@/app/api/_db/schema";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useJobMutations } from "@/features/jobs/hooks/use_jobs_mutations";

interface JobAdminActionsProps {
  id: string;
  status: JobStatus;
}

export function JobAdminActions({ id, status }: JobAdminActionsProps) {
  const router = useRouter();
  const { publish, close } = useJobMutations();

  const onError = () => toast.error("Action failed. Please try again.");
  const onSuccess = (message: string) => () => {
    toast.success(message);
    router.refresh();
  };

  return (
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
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Job actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href={`/admin/jobs/${id}/edit`} />}>
            <Pencil className="size-4" aria-hidden="true" />
            Edit details
          </DropdownMenuItem>
          {status !== "published" && (
            <DropdownMenuItem
              disabled={publish.isPending}
              onClick={() => publish.mutate(id, { onSuccess: onSuccess("Job published"), onError })}
            >
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Publish
            </DropdownMenuItem>
          )}
          {status !== "closed" && (
            <DropdownMenuItem
              disabled={close.isPending}
              onClick={() => close.mutate(id, { onSuccess: onSuccess("Job closed"), onError })}
            >
              <LockKeyhole className="size-4" aria-hidden="true" />
              Close
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
