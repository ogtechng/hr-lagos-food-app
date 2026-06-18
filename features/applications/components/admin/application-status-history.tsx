import type { ApplicationStatusEvent } from "@/app/api/_db/schema";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/utils";

interface ApplicationStatusHistoryProps {
  events: ApplicationStatusEvent[];
}

export function ApplicationStatusHistory({ events }: ApplicationStatusHistoryProps) {
  if (events.length === 0) {
    return (
      <EmptyState
        compact
        title="No status history"
        description="Decision changes will appear here after the first applicant status update."
      />
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div key={event.id} className="rounded-xl border p-3">
          <div className="flex items-center justify-between gap-3">
            <StatusBadge status={event.newStatus} />
            <span className="text-xs text-muted-foreground">{formatDate(event.createdAt)}</span>
          </div>
          {event.note && <p className="mt-2 text-sm text-muted-foreground">{event.note}</p>}
        </div>
      ))}
    </div>
  );
}
