import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  FileText,
  ListChecks,
  Plus,
  Search,
  Settings,
  UserCircle,
} from "lucide-react";

import { requireAdmin } from "@/app/api/_auth/require-admin";
import { AdminPageShell } from "@/components/shared/admin-page-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { make_applications_service } from "@/features/applications/services";
import { ReviewSparkline } from "@/features/dashboard/components/review-sparkline";
import { make_entities_service } from "@/features/entities/services";
import { make_jobs_service } from "@/features/jobs/services";
import { createServerApiClient } from "@/lib/server-api-client";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

function pct(part: number, total: number) {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}


export default async function AdminPage() {
  await requireAdmin();
  const api = await createServerApiClient();
  const [entities, jobs, applications] = await Promise.all([
    make_entities_service(api).get_all(),
    make_jobs_service(api).get_all(),
    make_applications_service(api).get_all(),
  ]);

  const activeEntities = entities.filter((entity) => entity.isActive).length;
  const publishedJobs = jobs.filter((job) => job.status === "published").length;
  const submitted = applications.filter((application) => application.status === "submitted").length;
  const accepted = applications.filter((application) => application.status === "accepted").length;
  const rejected = applications.filter((application) => application.status === "rejected").length;
  const decisions = accepted + rejected;
  const reviewRate = pct(decisions, applications.length);
  const publishRate = pct(publishedJobs, jobs.length);
  const recentApplications = applications.slice(0, 10);
  const today = new Intl.DateTimeFormat("en-NG", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const metrics = [
    {
      label: "Active entities",
      value: activeEntities,
      total: entities.length,
      icon: Building2,
      href: "/admin/entities",
      progress: pct(activeEntities, entities.length),
      iconClass: "bg-neutral-100 text-neutral-700",
      gradient: "linear-gradient(90deg, #737373, #171717)",
    },
    {
      label: "Published jobs",
      value: publishedJobs,
      total: jobs.length,
      icon: BriefcaseBusiness,
      href: "/admin/jobs",
      progress: publishRate,
      iconClass: "bg-neutral-100 text-neutral-700",
      gradient: "linear-gradient(90deg, #a3a3a3, #404040)",
    },
    {
      label: "New reviews",
      value: submitted,
      total: applications.length,
      icon: FileText,
      href: "/admin/applications",
      progress: pct(submitted, applications.length),
      iconClass: "bg-neutral-100 text-neutral-700",
      gradient: "linear-gradient(90deg, #d4d4d4, #737373)",
    },
    {
      label: "Decision rate",
      value: `${reviewRate}%`,
      total: `${decisions} decided`,
      icon: CheckCircle2,
      href: "/admin/reports",
      progress: reviewRate,
      iconClass: "bg-[var(--admin-lemon-soft)] text-neutral-800",
      gradient: "linear-gradient(90deg, #a3e635, #d9f99d)",
    },
  ];
  const reviewSparkline = [
    { label: "Entities", value: activeEntities },
    { label: "Published", value: publishedJobs },
    { label: "Applications", value: applications.length },
    { label: "Pending", value: submitted },
    { label: "Decided", value: decisions },
  ];
  return (
    <AdminPageShell className="space-y-5">
      <section className="relative overflow-hidden rounded-lg bg-[var(--admin-primary-strong)] p-5 text-white md:p-6">
        <div
          className="pointer-events-none absolute inset-0 opacity-95"
          style={{
            background:
              "radial-gradient(circle at 18% 10%, rgba(217,249,157,0.14), transparent 24%), radial-gradient(circle at 78% -10%, rgba(82,82,82,0.4), transparent 30%), linear-gradient(135deg, rgba(2,44,34,0.95), rgba(2,6,23,0.96) 58%, rgba(6,78,59,0.88))",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-16 top-[-35%] h-[28rem] w-[28rem] rounded-full border border-white/15"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-28 top-[-20%] h-[24rem] w-20 rotate-[28deg] rounded-full bg-white/8 blur-sm"
          aria-hidden="true"
        />
        <div className="relative">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-lg bg-[var(--admin-lemon)] text-[var(--admin-primary)]">
                <BriefcaseBusiness className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/55">
                  Produce for Lagos
                </p>
                <p className="text-sm font-semibold text-[var(--admin-lemon)]">HR Operations</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="hidden h-9 min-w-72 items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 text-sm text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur md:flex">
                <Search className="size-4" aria-hidden="true" />
                <span className="flex-1">Search jobs, applicants, entities</span>
              </div>
              {[Bell, Settings, UserCircle].map((Icon, index) => (
                <button
                  key={index}
                  type="button"
                  className="grid size-9 place-items-center rounded-lg bg-white/10 text-white/80 transition hover:bg-white/15 hover:text-[var(--admin-lemon)]"
                  aria-label={index === 0 ? "Notifications" : index === 1 ? "Settings" : "Account"}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 max-w-3xl">
            <p className="flex items-center gap-2 text-xs text-white/65">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              {today}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Good morning, HR team
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/68">
              Monitor open roles, applicant review work, and next actions across the Produce for Lagos
              hiring network.
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <nav className="flex flex-wrap gap-2 text-sm">
              {[
                ["Overview", "/admin"],
                ["Jobs", "/admin/jobs"],
                ["Applications", "/admin/applications"],
                ["Departments", "/admin/departments"],
                ["Reports", "/admin/reports"],
              ].map(([label, href], index) => (
                <Link
                  key={href}
                  href={href}
                  className={
                    index === 0
                      ? "inline-flex h-9 items-center gap-2 rounded-lg bg-white px-3 text-sm font-semibold text-[var(--admin-primary)]"
                      : "inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium text-white/65 transition hover:bg-white/10 hover:text-white"
                  }
                >
                  {index === 0 && <Activity className="size-4" aria-hidden="true" />}
                  {label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-wrap gap-2">
              <Button
                nativeButton={false}
                variant="outline"
                className="border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white"
                render={<Link href="/admin/reports" />}
              >
                View reports
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
              <Button
                nativeButton={false}
                className="bg-[var(--admin-primary)] text-[var(--admin-lemon)] hover:bg-[var(--admin-primary-strong)]"
                render={<Link href="/admin/jobs/new" />}
              >
                <Plus className="size-4" aria-hidden="true" />
                New job
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-surface dashboard-soft-ring grid overflow-hidden rounded-lg bg-[var(--admin-panel)] md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Link
              key={metric.label}
              href={metric.href}
              className="group border-b border-[var(--admin-border)] p-4 transition-colors hover:bg-[var(--admin-panel-muted)] md:even:border-l xl:border-b-0 xl:border-l xl:first:border-l-0"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--admin-muted)]">
                  {metric.label}
                </p>
                <span className={`grid size-8 place-items-center rounded-lg ${metric.iconClass}`}>
                  <Icon className="size-4" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="text-3xl font-semibold tracking-tight text-[var(--admin-text)]">
                  {metric.value}
                </p>
                <span className="text-xs font-medium text-[var(--admin-muted)]">{metric.total}</span>
              </div>
              <div className="mt-4 h-0.5 overflow-hidden rounded-full bg-[var(--admin-panel-muted)]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${metric.progress}%`, background: metric.gradient }}
                />
              </div>
            </Link>
          );
        })}
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <section className="dashboard-surface overflow-hidden rounded-lg bg-[var(--admin-panel)]">
          <div className="flex flex-col gap-3 border-b border-[var(--admin-border)] px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-[var(--admin-text)]">
                Recent applications
              </h2>
              <p className="mt-1 text-sm text-[var(--admin-muted)]">
                Latest {recentApplications.length} of {applications.length} submissions
              </p>
            </div>
            <Button
              nativeButton={false}
              variant="outline"
              size="sm"
              className="border-[var(--admin-border)] bg-[var(--admin-panel)] text-[var(--admin-text)] hover:bg-[var(--admin-panel-muted)]"
              render={<Link href="/admin/applications" />}
            >
              Open list
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>

          {recentApplications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="border-b border-[var(--admin-border)] bg-[var(--admin-panel-muted)] text-left text-xs font-semibold uppercase tracking-[0.12em] text-[var(--admin-muted)]">
                  <tr>
                    <th className="px-5 py-3">Applicant</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Applied</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--admin-border)]">
                  {recentApplications.map((application) => (
                    <tr
                      key={application.id}
                      className="transition-colors hover:bg-[var(--admin-panel-muted)]"
                    >
                      <td className="px-5 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-neutral-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`https://api.dicebear.com/10.x/glyphs/svg?seed=${encodeURIComponent(application.name)}`}
                              alt=""
                              className="size-full"
                            />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[var(--admin-text)]">
                              {application.name}
                            </p>
                            <p className="truncate text-xs text-[var(--admin-muted)]">
                              {application.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="max-w-[14rem] truncate px-4 py-3 text-[var(--admin-text)]/80">
                        {application.jobTitle}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={application.status} />
                      </td>
                      <td className="px-4 py-3 text-[var(--admin-muted)]">
                        {formatDate(application.createdAt)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Button
                          nativeButton={false}
                          variant="outline"
                          size="sm"
                          className="border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-100"
                          render={<Link href={`/admin/applications/${application.id}`} />}
                        >
                          Review
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-5">
              <EmptyState
                compact
                title="No recent applications"
                description="New applicant submissions will appear here once public roles receive applications."
              />
            </div>
          )}
        </section>

        <aside className="space-y-3 xl:sticky xl:top-5 xl:self-start">
          <div className="dashboard-surface rounded-lg bg-[var(--admin-primary-strong)] p-4 text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[var(--admin-lemon)]">Review focus</p>
                <p className="mt-2 text-2xl font-semibold">{submitted} pending</p>
              </div>
              <span className="grid size-9 place-items-center rounded-lg bg-white/10 text-[var(--admin-lemon)]">
                <ListChecks className="size-4" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Prioritize submitted applications before publishing new roles.
            </p>
            <ReviewSparkline data={reviewSparkline} />
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs text-white/60">
                <span>Decision progress</span>
                <span>{reviewRate}%</span>
              </div>
              <div className="h-0.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[var(--admin-lemon)]"
                  style={{ width: `${reviewRate}%` }}
                />
              </div>
            </div>
          </div>

        </aside>
      </div>
    </AdminPageShell>
  );
}
