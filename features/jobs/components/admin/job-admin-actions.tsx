"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { JobStatus } from "@/app/api/_db/schema";
import { Button } from "@/components/ui/button";
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
    <div className="flex gap-2">
      {status !== "published" && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={publish.isPending}
          onClick={() => publish.mutate(id, { onSuccess: onSuccess("Job published"), onError })}
        >
          Publish
        </Button>
      )}
      {status !== "closed" && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={close.isPending}
          onClick={() => close.mutate(id, { onSuccess: onSuccess("Job closed"), onError })}
        >
          Close
        </Button>
      )}
    </div>
  );
}
