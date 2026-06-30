import { and, asc, count, desc, eq, gte, ilike, lte, or, type SQL } from "drizzle-orm";

import { db } from "@/app/api/_db";
import { applications, entities, jobs } from "@/app/api/_db/schema";
import type { ReportFilters, ReportListQuery } from "@/app/api/_schemas/reports/report.schema";
import {
  createPaginatedResult,
  getOffset,
} from "@/app/api/_schemas/shared/list-query.schema";

function buildReportFilters(filters: ReportFilters = {}) {
  const conditions: SQL[] = [];

  if (filters.entityId) conditions.push(eq(jobs.entityId, filters.entityId));
  if (filters.jobId) conditions.push(eq(applications.jobId, filters.jobId));
  if (filters.status) conditions.push(eq(applications.status, filters.status));
  if (filters.createdFrom) conditions.push(gte(applications.createdAt, filters.createdFrom));
  if (filters.createdTo) conditions.push(lte(applications.createdAt, filters.createdTo));
  if (filters.search) {
    const search = `%${filters.search}%`;
    conditions.push(
      or(
        ilike(applications.name, search),
        ilike(applications.email, search),
        ilike(jobs.title, search),
        ilike(entities.name, search),
      )!,
    );
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
}

function reportOrderBy(query: ReportListQuery) {
  const direction = query.sortDir === "asc" ? asc : desc;

  if (query.sortBy === "applicantName") return direction(applications.name);
  if (query.sortBy === "email") return direction(applications.email);
  if (query.sortBy === "phone") return direction(applications.phone);
  if (query.sortBy === "state") return direction(applications.state);
  if (query.sortBy === "job") return direction(jobs.title);
  if (query.sortBy === "entity") return direction(entities.name);
  if (query.sortBy === "status") return direction(applications.status);
  return direction(applications.createdAt);
}

export async function getApplicationsReport(filters: ReportFilters = {}) {
  const where = buildReportFilters(filters);
  const query = db
    .select({
      applicationId: applications.id,
      applicantName: applications.name,
      applicantEmail: applications.email,
      applicantPhone: applications.phone,
      applicantState: applications.state,
      status: applications.status,
      cvUrl: applications.cvUrl,
      cvFileName: applications.cvFileName,
      adminNote: applications.adminNote,
      appliedAt: applications.createdAt,
      jobId: jobs.id,
      jobTitle: jobs.title,
      jobSlug: jobs.slug,
      jobLocation: jobs.location,
      jobDepartment: jobs.department,
      entityId: entities.id,
      entityName: entities.name,
      entitySlug: entities.slug,
    })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .innerJoin(entities, eq(jobs.entityId, entities.id))
    .$dynamic();

  if (where) query.where(where);

  return query.orderBy(desc(applications.createdAt));
}

export async function getApplicationsReportPaginated(queryInput: ReportListQuery) {
  const where = buildReportFilters(queryInput);
  const [{ total }] = await db
    .select({ total: count() })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .innerJoin(entities, eq(jobs.entityId, entities.id))
    .where(where);
  const rows = await db
    .select({
      applicationId: applications.id,
      applicantName: applications.name,
      applicantEmail: applications.email,
      applicantPhone: applications.phone,
      applicantState: applications.state,
      status: applications.status,
      cvUrl: applications.cvUrl,
      cvFileName: applications.cvFileName,
      adminNote: applications.adminNote,
      appliedAt: applications.createdAt,
      jobId: jobs.id,
      jobTitle: jobs.title,
      jobSlug: jobs.slug,
      jobLocation: jobs.location,
      jobDepartment: jobs.department,
      entityId: entities.id,
      entityName: entities.name,
      entitySlug: entities.slug,
    })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .innerJoin(entities, eq(jobs.entityId, entities.id))
    .where(where)
    .orderBy(reportOrderBy(queryInput))
    .limit(queryInput.pageSize)
    .offset(getOffset(queryInput));

  return createPaginatedResult(rows, total, queryInput);
}

export async function getApplicationsReportSummary(filters: ReportFilters = {}) {
  const rows = await getApplicationsReport(filters);

  return {
    total: rows.length,
    submitted: rows.filter((row) => row.status === "submitted").length,
    accepted: rows.filter((row) => row.status === "accepted").length,
    rejected: rows.filter((row) => row.status === "rejected").length,
  };
}
