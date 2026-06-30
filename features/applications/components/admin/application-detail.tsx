import { FileText } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { ApplicationStatusActions } from "@/features/applications/components/admin/application-status-actions";
import { ApplicationStatusHistory } from "@/features/applications/components/admin/application-status-history";
import { AdminNoteForm } from "@/features/applications/components/admin/admin-note-form";
import { CvPreview } from "@/features/applications/components/admin/cv-preview";
import type { ApplicationStatusEvent } from "@/app/api/_db/schema";

interface ApplicationDetailRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  state: string;
  address: string;
  jobTitle: string;
  entityName: string;
  cvUrl: string;
  cvFileName: string | null;
  cvStoragePath: string | null;
  coverLetterStoragePath: string | null;
  status: string;
  adminNote: string | null;
}

interface ApplicationDetailProps {
  application: ApplicationDetailRecord;
  events: ApplicationStatusEvent[];
}

function Panel({
  title,
  action,
  children,
  bodyClassName = "p-4",
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  bodyClassName?: string;
}) {
  return (
    <section className="dashboard-soft-ring overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-panel)]">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--admin-border)] px-4 py-3">
        <h2 className="font-display text-base tracking-tight text-[var(--admin-text)]">{title}</h2>
        {action}
      </div>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[var(--admin-muted)]">
        {label}
      </p>
      <p className="mt-1 break-words text-sm text-[var(--admin-text)]">{value || "—"}</p>
    </div>
  );
}

export function ApplicationDetail({ application, events }: ApplicationDetailProps) {
  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,30%)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-5">
        <section className="dashboard-soft-ring overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-panel)]">
          <div className="flex items-start justify-between gap-3 border-b border-[var(--admin-border)] px-4 py-3">
            <div className="min-w-0">
              <h2 className="truncate font-display text-xl tracking-tight text-[var(--admin-text)]">
                {application.name}
              </h2>
              <p className="mt-1 break-words text-sm text-[var(--admin-muted)]">
                {application.email} · {application.phone}
              </p>
            </div>
            <StatusBadge status={application.status} />
          </div>
          <div className="grid gap-4 p-4 sm:grid-cols-2">
            <Field label="Job" value={application.jobTitle} />
            <Field label="Entity" value={application.entityName} />
            <Field label="State" value={application.state} />
            <Field label="Address" value={application.address} />
          </div>
          {application.coverLetterStoragePath && (
            <div className="border-t border-[var(--admin-border)] px-4 py-3">
              <a
                href={`/api/admin/applications/${application.id}/cover-letter`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-800 hover:underline"
              >
                <FileText className="size-4" aria-hidden="true" />
                View cover letter
              </a>
            </div>
          )}
        </section>

        <Panel title="Admin note">
          <AdminNoteForm applicationId={application.id} adminNote={application.adminNote} />
        </Panel>

        <Panel title="Status history">
          <ApplicationStatusHistory events={events} />
        </Panel>
      </div>

      <div className="min-w-0">
        <CvPreview
          applicationId={application.id}
          fileName={application.cvFileName}
          hasStoragePath={Boolean(application.cvStoragePath)}
          applicantName={application.name}
          actions={<ApplicationStatusActions applicationId={application.id} />}
        />
      </div>
    </div>
  );
}
