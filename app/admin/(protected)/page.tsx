import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Building2, CheckCircle2, FileText } from "lucide-react";

import { requireAdmin } from "@/app/api/_auth/require-admin";
import { AdminPageShell } from "@/components/shared/admin-page-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { make_applications_service } from "@/features/applications/services";
import { make_entities_service } from "@/features/entities/services";
import { make_jobs_service } from "@/features/jobs/services";
import { createServerApiClient } from "@/lib/server-api-client";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

function pct(part: number, total: number) {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function AdminPage() {
  await requireAdmin();
  const api = await createServerApiClient();
  const [entities, jobs, applications] = await Promise.all([
    make_entities_service(api).get_all(),
    make_jobs_service(api).get_all(),
    make_applications_service(api).get_all(),
  ]);

  const activeEntities = entities.filter((e) => e.isActive).length;
  const publishedJobs = jobs.filter((j) => j.status === "published").length;
  const submitted = applications.filter((a) => a.status === "submitted").length;
  const accepted = applications.filter((a) => a.status === "accepted").length;
  const rejected = applications.filter((a) => a.status === "rejected").length;
  const decisions = applications.filter((a) => a.status !== "submitted").length;
  const publishedRate = pct(publishedJobs, jobs.length);
  const reviewRate = pct(decisions, applications.length);

  const recentApplications = applications.slice(0, 5);

  return (
    <AdminPageShell>
      <PageHeader
        title="Hiring"
        titleAccent="dashboard"
        description="Track open hiring work across entities, jobs, applicants, and review decisions."
      >
        <Button nativeButton={false} render={<Link href="/admin/jobs/new" />}>
          New job
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Entities"
          value={entities.length}
          description={`${activeEntities} active entities`}
          icon={<Building2 className="size-4" aria-hidden="true" />}
        />
        <StatsCard
          title="Jobs"
          value={jobs.length}
          description={`${publishedJobs} published · ${publishedRate}% live`}
          icon={<BriefcaseBusiness className="size-4" aria-hidden="true" />}
        />
        <StatsCard
          title="Applications"
          value={applications.length}
          description={`${submitted} awaiting review`}
          icon={<FileText className="size-4" aria-hidden="true" />}
        />
        <StatsCard
          title="Decisions"
          value={decisions}
          description={`${accepted} accepted · ${rejected} rejected`}
          icon={<CheckCircle2 className="size-4" aria-hidden="true" />}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="overflow-hidden rounded-3xl border border-[#ddd8cc] bg-[#fbfaf6]">
          <div className="flex items-center justify-between gap-4 border-b border-[#e6e0d3] px-5 py-4">
            <div>
              <h2 className="font-display text-xl tracking-tight">Recent applications</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Latest {recentApplications.length} of {applications.length} submissions
              </p>
            </div>
            <Button
              nativeButton={false}
              variant="outline"
              size="sm"
              render={<Link href="/admin/applications" />}
            >
              View all
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>

          {recentApplications.length > 0 ? (
            <ul className="divide-y divide-[#e6e0d3]">
              {recentApplications.map((application) => (
                <li key={application.id}>
                  <Link
                    href={`/admin/applications/${application.id}`}
                    className="grid gap-3 px-5 py-4 transition-colors hover:bg-[#f4f1e8] md:grid-cols-[1fr_auto] md:items-center"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-[#c8dcc7] bg-[#e9f4df] text-xs font-semibold text-[#0b6132]">
                        {initials(application.name)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{application.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {application.jobTitle} · {formatDate(application.createdAt)}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={application.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-5">
              <EmptyState
                compact
                title="No recent applications"
                description="New applicant submissions will appear here once public roles receive applications."
              />
            </div>
          )}
        </div>

        <div className="grid gap-5">
          <section className="rounded-3xl border border-[#0c5b30] bg-[#064b28] p-5 text-[#f2f0e6]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#c7ddbd]">
              Review health
            </p>
            <p className="mt-4 font-display text-5xl leading-none text-[#dfff67]">{reviewRate}%</p>
            <p className="mt-3 text-sm leading-6 text-[#d9e8d2]">
              of applications have a decision. Keep submitted applications moving from review to
              accepted or rejected.
            </p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-[#dfff67]"
                style={{ width: `${reviewRate}%` }}
              />
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-[#ddd8cc] bg-[#fbfaf6]">
            <div className="border-b border-[#e6e0d3] px-5 py-4">
              <h2 className="font-display text-xl tracking-tight">Quick paths</h2>
            </div>
            <div className="divide-y divide-[#e6e0d3]">
              {[
                ["Manage entities", "/admin/entities"],
                ["Review applications", "/admin/applications"],
                ["Export reports", "/admin/reports"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between gap-3 px-5 py-4 text-sm font-medium transition-colors hover:bg-[#f4f1e8]"
                >
                  {label}
                  <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AdminPageShell>
  );
}
