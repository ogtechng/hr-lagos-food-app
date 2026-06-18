import { StatsCard } from "@/components/shared/stats-card";

interface ReportsSummaryCardsProps {
  summary: {
    total: number;
    submitted: number;
    accepted: number;
    rejected: number;
  };
}

export function ReportsSummaryCards({ summary }: ReportsSummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatsCard title="Total applications" value={summary.total} />
      <StatsCard title="Submitted" value={summary.submitted} />
      <StatsCard title="Accepted" value={summary.accepted} />
      <StatsCard title="Rejected" value={summary.rejected} />
    </div>
  );
}
