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
import { formatDate } from "@/lib/utils";

interface AdminApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  entityName: string;
  status: string;
  createdAt: Date;
}

interface ApplicationsTableProps {
  applications: AdminApplication[];
}

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  if (applications.length === 0) {
    return (
      <EmptyState
        title="No applications found"
        description="Try a different filter range, or check back after applicants submit."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-[#ddd8cc] bg-[#fbfaf6]">
      <Table className="min-w-[880px]">
        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead>Job</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell>
                <div className="font-medium">{application.name}</div>
                <div className="text-xs text-muted-foreground">
                  {application.email} · {application.phone}
                </div>
              </TableCell>
              <TableCell>{application.jobTitle}</TableCell>
              <TableCell>{application.entityName}</TableCell>
              <TableCell>
                <StatusBadge status={application.status} />
              </TableCell>
              <TableCell>{formatDate(application.createdAt)}</TableCell>
              <TableCell>
                <Button
                  nativeButton={false}
                  variant="ghost"
                  size="sm"
                  render={<Link href={`/admin/applications/${application.id}`} />}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
