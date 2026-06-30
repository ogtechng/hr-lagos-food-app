"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import type { Entity, Job, JobStatus } from "@/app/api/_db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminDepartment } from "@/features/departments/types/department.types";
import { EMPLOYMENT_TYPE_OPTIONS, JOB_STATUS_OPTIONS } from "@/features/jobs/data/job-options";
import NIGERIAN_STATES from "@/features/jobs/data/nigerian-states.json";
import { useJobMutations } from "@/features/jobs/hooks/use_jobs_mutations";
import { RichTextEditor } from "@/features/rich-text/components/rich-text-editor";

interface JobFormProps {
  entities: Entity[];
  departments: AdminDepartment[];
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
    department: value(formData, "department") || null,
    location: value(formData, "location"),
    employmentType: value(formData, "employmentType") || null,
    description: value(formData, "description") || null,
    responsibilities: null,
    requirements: null,
    status: (value(formData, "status") || "draft") as JobStatus,
  };
}

export function JobForm({ entities, departments, job }: JobFormProps) {
  const router = useRouter();
  const { create, update } = useJobMutations();
  const pending = create.isPending || update.isPending;
  const [selectedEntityId, setSelectedEntityId] = useState(job?.entityId ?? "");
  const entityDepartments = useMemo(
    () =>
      departments.filter(
        (department) => !department.entityId || department.entityId === selectedEntityId,
      ),
    [departments, selectedEntityId],
  );
  const bodyDefaultValue = [job?.description, job?.responsibilities, job?.requirements]
    .filter(Boolean)
    .join("<hr><p></p>");

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
            className="admin-control h-10 w-full border border-input bg-background px-3.5 text-sm"
            onChange={(event) => setSelectedEntityId(event.currentTarget.value)}
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
            className="admin-control h-10 w-full border border-input bg-background px-3.5 text-sm"
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
          <span className="text-sm font-semibold">Department</span>
          <select
            name="department"
            defaultValue={job?.department ?? ""}
            className="admin-control h-10 w-full border border-input bg-background px-3.5 text-sm"
            disabled={!selectedEntityId}
          >
            <option value="">
              {selectedEntityId ? "Select department" : "Select entity first"}
            </option>
            {entityDepartments.map((department) => (
              <option key={department.id} value={department.name}>
                {department.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Location</span>
          <select
            name="location"
            defaultValue={job?.location ?? ""}
            required
            className="admin-control h-10 w-full border border-input bg-background px-3.5 text-sm"
          >
            <option value="">Select location</option>
            {NIGERIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Employment type</span>
          <select
            name="employmentType"
            defaultValue={job?.employmentType ?? ""}
            className="admin-control h-10 w-full border border-input bg-background px-3.5 text-sm"
          >
            <option value="">Select employment type</option>
            {EMPLOYMENT_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="space-y-2 block">
        <span className="text-sm font-semibold">Job description</span>
        <RichTextEditor
          name="description"
          defaultValue={bodyDefaultValue}
          minHeightClassName="min-h-[30rem]"
          placeholder="Describe the role, responsibilities, requirements, benefits, and hiring context..."
        />
      </label>
      <Button type="submit" disabled={pending} size="lg">
        {pending ? "Saving..." : job ? "Update job" : "Create job"}
      </Button>
    </form>
  );
}
