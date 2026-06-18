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
  bodyClassName = "p-5",
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  bodyClassName?: string;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-black/6 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-[#f0ede4] px-5 py-3.5">
        <h2 className="font-display text-base tracking-tight text-[#1a1916]">{title}</h2>
        {action}
      </div>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#8a877d]">
        {label}
      </p>
      <p className="mt-1 break-words text-sm text-[#3f3c35]">{value || "—"}</p>
    </div>
  );
}

export function ApplicationDetail({ application, events }: ApplicationDetailProps) {
  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,30%)_minmax(0,1fr)]">
      {/* Left — details (≈30%) */}
      <div className="min-w-0 space-y-5">
        <section className="overflow-hidden rounded-2xl border border-black/6 bg-white shadow-sm">
          <div className="flex items-start justify-between gap-3 border-b border-[#f0ede4] px-5 py-4">
            <div className="min-w-0">
              <h2 className="truncate font-display text-xl tracking-tight text-[#1a1916]">
                {application.name}
              </h2>
              <p className="mt-1 break-words text-sm text-[#6b675f]">
                {application.email} · {application.phone}
              </p>
            </div>
            <StatusBadge status={application.status} />
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <Field label="Job" value={application.jobTitle} />
            <Field label="Entity" value={application.entityName} />
            <Field label="State" value={application.state} />
            <Field label="Address" value={application.address} />
          </div>
          {application.coverLetterStoragePath && (
            <div className="border-t border-[#f0ede4] px-5 py-3">
              <a
                href={`/api/admin/applications/${application.id}/cover-letter`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0b6132] hover:underline"
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

        <Panel title="Status actions">
          <ApplicationStatusActions applicationId={application.id} />
        </Panel>

        <Panel title="Status history">
          <ApplicationStatusHistory events={events} />
        </Panel>
      </div>

      {/* Right — live CV preview (≈70%) */}
      <div className="min-w-0">
        <CvPreview
          applicationId={application.id}
          fileName={application.cvFileName}
          hasStoragePath={Boolean(application.cvStoragePath)}
          applicantName={application.name}
        />
      </div>
    </div>
  );
}
