import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { JobAdminActions } from "@/features/jobs/components/admin/job-admin-actions";

interface AdminJob {
  id: string;
  title: string;
  entityName: string;
  location: string;
  status: string;
  createdAt: Date;
}

interface JobsTableProps {
  jobs: AdminJob[];
}

export function JobsTable({ jobs }: JobsTableProps) {
  if (jobs.length === 0) {
    return (
      <EmptyState
        title="No jobs found"
        description="Adjust the filters or create a new role when hiring opens."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-[#ddd8cc] bg-[#fbfaf6]">
      <Table className="min-w-[760px]">
        <TableHeader>
          <TableRow>
            <TableHead>Job</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">{job.title}</TableCell>
              <TableCell>{job.entityName}</TableCell>
              <TableCell>{job.location}</TableCell>
              <TableCell>
                <StatusBadge status={job.status} />
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  <Button
                    nativeButton={false}
                    variant="ghost"
                    size="sm"
                    render={<Link href={`/admin/jobs/${job.id}/edit`} />}
                  >
                    Edit
                  </Button>
                  <JobAdminActions id={job.id} status={job.status as never} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
