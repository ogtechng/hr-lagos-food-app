"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useApplicationMutations } from "@/features/applications/hooks/use_applications_mutations";

interface AdminNoteFormProps {
  applicationId: string;
  adminNote: string | null;
}

export function AdminNoteForm({ applicationId, adminNote }: AdminNoteFormProps) {
  const router = useRouter();
  const { updateNote } = useApplicationMutations();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const note = formData.get("adminNote");

    updateNote.mutate(
      { id: applicationId, adminNote: typeof note === "string" && note ? note : null },
      {
        onSuccess: () => {
          toast.success("Note saved");
          router.refresh();
        },
        onError: () => toast.error("Could not save the note. Please try again."),
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        name="adminNote"
        defaultValue={adminNote ?? ""}
        placeholder="Add an internal note"
      />
      <Button type="submit" variant="outline" disabled={updateNote.isPending}>
        {updateNote.isPending ? "Saving..." : "Save note"}
      </Button>
    </form>
  );
}
