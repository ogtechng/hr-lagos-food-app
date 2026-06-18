import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

interface ReportRow {
  applicationId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantState: string;
  jobTitle: string;
  entityName: string;
  status: string;
  appliedAt: Date;
}

interface ReportsTableProps {
  rows: ReportRow[];
}

export function ReportsTable({ rows }: ReportsTableProps) {
  if (rows.length === 0) {
    return (
      <EmptyState
        title="No report data"
        description="No applications match the current report filters. Reset filters or widen the date range."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-[#ddd8cc] bg-[#fbfaf6]">
      <Table className="min-w-[980px]">
        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Job</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Application date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.applicationId}>
              <TableCell className="font-medium">{row.applicantName}</TableCell>
              <TableCell>{row.applicantEmail}</TableCell>
              <TableCell>{row.applicantPhone}</TableCell>
              <TableCell>{row.applicantState}</TableCell>
              <TableCell>{row.jobTitle}</TableCell>
              <TableCell>{row.entityName}</TableCell>
              <TableCell>
                <StatusBadge status={row.status} />
              </TableCell>
              <TableCell>{formatDate(row.appliedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
