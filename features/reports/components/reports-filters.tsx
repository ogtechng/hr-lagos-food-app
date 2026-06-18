import Link from "next/link";

import type { Entity } from "@/app/api/_db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ReportJobOption {
  id: string;
  title: string;
}

interface ReportsFiltersProps {
  entities: Entity[];
  jobs: ReportJobOption[];
  values: {
    dateFrom?: string;
    dateTo?: string;
    entity?: string;
    job?: string;
    status?: string;
  };
}

export function ReportsFilters({ entities, jobs, values }: ReportsFiltersProps) {
  return (
    <form className="grid gap-3 rounded-3xl border border-[#ddd8cc] bg-[#fbfaf6] p-4 md:grid-cols-2 xl:grid-cols-[0.9fr_0.9fr_1fr_1fr_0.9fr_auto] xl:items-end">
      <label className="grid gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Date from
        </span>
        <Input name="dateFrom" type="date" defaultValue={values.dateFrom} />
      </label>
      <label className="grid gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Date to
        </span>
        <Input name="dateTo" type="date" defaultValue={values.dateTo} />
      </label>
      <label className="grid gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Entity
        </span>
        <select
          name="entity"
          defaultValue={values.entity ?? ""}
          className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
        >
          <option value="">All entities</option>
          {entities.map((entity) => (
            <option key={entity.id} value={entity.id}>
              {entity.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Job
        </span>
        <select
          name="job"
          defaultValue={values.job ?? ""}
          className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
        >
          <option value="">All jobs</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
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
          defaultValue={values.status ?? ""}
          className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
        >
          <option value="">All statuses</option>
          <option value="submitted">Submitted</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </label>
      <div className="flex items-end gap-2">
        <Button type="submit">Apply</Button>
        <Button nativeButton={false} variant="outline" render={<Link href="/admin/reports" />}>
          Reset
        </Button>
      </div>
    </form>
  );
}
