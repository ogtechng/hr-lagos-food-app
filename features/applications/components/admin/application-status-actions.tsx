"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
import { Textarea } from "@/components/ui/textarea";
import { useApplicationMutations } from "@/features/applications/hooks/use_applications_mutations";

type Decision = "accepted" | "rejected";

const COPY: Record<
  Decision,
  { trigger: string; title: string; description: string; confirm: string }
> = {
  accepted: {
    trigger: "Accept applicant",
    title: "Accept this applicant?",
    description:
      "The applicant will be marked as accepted and notified by email. You can change this later.",
    confirm: "Accept applicant",
  },
  rejected: {
    trigger: "Reject applicant",
    title: "Reject this applicant?",
    description:
      "The applicant will be marked as rejected and notified by email. You can change this later.",
    confirm: "Reject applicant",
  },
};

interface ApplicationStatusActionsProps {
  applicationId: string;
}

export function ApplicationStatusActions({ applicationId }: ApplicationStatusActionsProps) {
  const router = useRouter();
  const { updateStatus } = useApplicationMutations();
  const [open, setOpen] = useState<Decision | null>(null);
  const [notes, setNotes] = useState<Record<Decision, string>>({ accepted: "", rejected: "" });

  function runUpdate(status: Decision) {
    const note = notes[status].trim();
    updateStatus.mutate(
      { id: applicationId, input: { status, note: note || null, changedBy: "admin" } },
      {
        onSuccess: () => {
          toast.success(`Applicant ${status}`);
          router.refresh();
        },
        onError: () => toast.error("Action failed. Please try again."),
      },
    );
    setOpen(null);
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {(["accepted", "rejected"] as const).map((status) => {
        const copy = COPY[status];
        const destructive = status === "rejected";

        return (
          <div key={status} className="space-y-3 rounded-2xl border p-4">
            <Textarea
              value={notes[status]}
              onChange={(event) => setNotes((prev) => ({ ...prev, [status]: event.target.value }))}
              placeholder={`Optional ${status} note`}
            />

            <AlertDialog
              open={open === status}
              onOpenChange={(next: boolean) => setOpen(next ? status : null)}
            >
              <AlertDialogTrigger
                render={
                  <Button
                    variant={destructive ? "destructive" : "default"}
                    disabled={updateStatus.isPending}
                  />
                }
              >
                {copy.trigger}
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{copy.title}</AlertDialogTitle>
                  <AlertDialogDescription>{copy.description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant={destructive ? "destructive" : "default"}
                    onClick={() => runUpdate(status)}
                  >
                    {copy.confirm}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <p className="text-xs text-muted-foreground">Confirm before submitting this action.</p>
          </div>
        );
      })}
    </div>
  );
}
