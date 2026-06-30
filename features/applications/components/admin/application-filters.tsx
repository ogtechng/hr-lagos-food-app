import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Option {
  id: string;
  label: string;
}

interface ApplicationFiltersProps {
  jobs: Option[];
  entities: Option[];
  searchParams: Record<string, string | undefined>;
}

export function ApplicationFilters({ jobs, entities, searchParams }: ApplicationFiltersProps) {
  return (
    <form className="admin-filter-panel grid gap-3 rounded-lg p-3 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_0.9fr_0.9fr_0.9fr_auto] xl:items-end">
      <label className="grid gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Search
        </span>
        <Input
          name="search"
          placeholder="Name, email, or phone"
          defaultValue={searchParams.search}
        />
      </label>
      <label className="grid gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Job
        </span>
        <select
          name="jobId"
          defaultValue={searchParams.jobId ?? ""}
          className="admin-control h-9 border border-input bg-background px-2.5 text-sm"
        >
          <option value="">All jobs</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Entity
        </span>
        <select
          name="entityId"
          defaultValue={searchParams.entityId ?? ""}
          className="admin-control h-9 border border-input bg-background px-2.5 text-sm"
        >
          <option value="">All entities</option>
          {entities.map((entity) => (
            <option key={entity.id} value={entity.id}>
              {entity.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Status
        </span>
        <select
          name="status"
          defaultValue={searchParams.status ?? ""}
          className="admin-control h-9 border border-input bg-background px-2.5 text-sm"
        >
          <option value="">All statuses</option>
          <option value="submitted">Submitted</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </label>
      <label className="grid gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          From
        </span>
        <Input name="createdFrom" type="date" defaultValue={searchParams.createdFrom} />
      </label>
      <label className="grid gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          To
        </span>
        <Input name="createdTo" type="date" defaultValue={searchParams.createdTo} />
      </label>
      <Button type="submit">Filter</Button>
    </form>
  );
}
