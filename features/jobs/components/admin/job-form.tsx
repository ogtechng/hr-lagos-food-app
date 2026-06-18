"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Entity, Job, JobStatus } from "@/app/api/_db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { JOB_STATUS_OPTIONS } from "@/features/jobs/data/job-options";
import { useJobMutations } from "@/features/jobs/hooks/use_jobs_mutations";

interface JobFormProps {
  entities: Entity[];
  job?: Job;
}

function value(formData: FormData, key: string) {
  const item = formData.get(key);
  return typeof item === "string" ? item : "";
}

function jobInput(formData: FormData) {
  return {
    entityId: value(formData, "entityId"),
    title: value(formData, "title"),
    slug: value(formData, "slug"),
    department: value(formData, "department") || null,
    location: value(formData, "location"),
    employmentType: value(formData, "employmentType") || null,
    description: value(formData, "description") || null,
    responsibilities: value(formData, "responsibilities") || null,
    requirements: value(formData, "requirements") || null,
    status: (value(formData, "status") || "draft") as JobStatus,
  };
}

export function JobForm({ entities, job }: JobFormProps) {
  const router = useRouter();
  const { create, update } = useJobMutations();
  const pending = create.isPending || update.isPending;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = jobInput(new FormData(event.currentTarget));

    const onSuccess = () => {
      toast.success(job ? "Job updated" : "Job created");
      router.push("/admin/jobs");
      router.refresh();
    };
    const onError = () => toast.error("Could not save the job. Please try again.");

    if (job) {
      update.mutate({ id: job.id, input }, { onSuccess, onError });
    } else {
      create.mutate(input, { onSuccess, onError });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold">Entity</span>
          <select
            name="entityId"
            defaultValue={job?.entityId ?? ""}
            required
            className="h-10 w-full rounded-xl border border-input bg-background px-3.5 text-sm"
          >
            <option value="">Select entity</option>
            {entities.map((entity) => (
              <option key={entity.id} value={entity.id}>
                {entity.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Status</span>
          <select
            name="status"
            defaultValue={job?.status ?? "draft"}
            className="h-10 w-full rounded-xl border border-input bg-background px-3.5 text-sm"
          >
            {JOB_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold">Title</span>
          <Input name="title" defaultValue={job?.title ?? ""} required />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Slug</span>
          <Input name="slug" defaultValue={job?.slug ?? ""} required />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Department</span>
          <Input name="department" defaultValue={job?.department ?? ""} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Location</span>
          <Input name="location" defaultValue={job?.location ?? ""} required />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Employment type</span>
          <Input name="employmentType" defaultValue={job?.employmentType ?? ""} />
        </label>
      </div>
      <label className="space-y-2 block">
        <span className="text-sm font-semibold">Description</span>
        <Textarea name="description" defaultValue={job?.description ?? ""} />
      </label>
      <label className="space-y-2 block">
        <span className="text-sm font-semibold">Responsibilities</span>
        <Textarea name="responsibilities" defaultValue={job?.responsibilities ?? ""} />
      </label>
      <label className="space-y-2 block">
        <span className="text-sm font-semibold">Requirements</span>
        <Textarea name="requirements" defaultValue={job?.requirements ?? ""} />
      </label>
      <Button type="submit" disabled={pending} size="lg">
        {pending ? "Saving..." : job ? "Update job" : "Create job"}
      </Button>
    </form>
  );
}
