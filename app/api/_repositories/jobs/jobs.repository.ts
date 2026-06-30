import { and, asc, count, desc, eq, ilike, type SQL } from "drizzle-orm";

import { db } from "@/app/api/_db";
import { entities, jobs, type JobStatus, type NewJob } from "@/app/api/_db/schema";
import type {
  AdminJobListQuery,
  JobFilters,
  UpdateJobInput,
} from "@/app/api/_schemas/jobs/job.schema";
import {
  createPaginatedResult,
  getOffset,
} from "@/app/api/_schemas/shared/list-query.schema";

function buildJobFilters(filters: JobFilters = {}) {
  const conditions: SQL[] = [];

  if (filters.entityId) conditions.push(eq(jobs.entityId, filters.entityId));
  if (filters.entitySlug) conditions.push(eq(entities.slug, filters.entitySlug));
  if (filters.status) conditions.push(eq(jobs.status, filters.status));
  if (filters.department) conditions.push(ilike(jobs.department, `%${filters.department}%`));
  if (filters.location) conditions.push(ilike(jobs.location, `%${filters.location}%`));
  if (filters.employmentType) {
    conditions.push(ilike(jobs.employmentType, `%${filters.employmentType}%`));
  }
  if (filters.search) conditions.push(ilike(jobs.title, `%${filters.search}%`));

  return conditions.length > 0 ? and(...conditions) : undefined;
}

function jobOrderBy(query: AdminJobListQuery) {
  const direction = query.sortDir === "asc" ? asc : desc;

  if (query.sortBy === "title") return direction(jobs.title);
  if (query.sortBy === "entity") return direction(entities.name);
  if (query.sortBy === "department") return direction(jobs.department);
  if (query.sortBy === "location") return direction(jobs.location);
  if (query.sortBy === "status") return direction(jobs.status);
  return direction(jobs.createdAt);
}

export async function createJob(data: NewJob) {
  const [job] = await db.insert(jobs).values(data).returning();
  return job;
}

export async function updateJob(id: string, data: UpdateJobInput) {
  const [job] = await db
    .update(jobs)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(jobs.id, id))
    .returning();

  return job ?? null;
}

export async function getJobById(id: string) {
  const [job] = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return job ?? null;
}

export async function getPublishedJobById(id: string) {
  const [job] = await db
    .select({
      id: jobs.id,
      entityId: jobs.entityId,
      entityName: entities.name,
      entitySlug: entities.slug,
      title: jobs.title,
      slug: jobs.slug,
      department: jobs.department,
      location: jobs.location,
      employmentType: jobs.employmentType,
      description: jobs.description,
      responsibilities: jobs.responsibilities,
      requirements: jobs.requirements,
      status: jobs.status,
      createdAt: jobs.createdAt,
      updatedAt: jobs.updatedAt,
    })
    .from(jobs)
    .innerJoin(entities, eq(jobs.entityId, entities.id))
    .where(and(eq(jobs.id, id), eq(jobs.status, "published")))
    .limit(1);

  return job ?? null;
}

export async function getJobBySlug(slug: string) {
  const [job] = await db.select().from(jobs).where(eq(jobs.slug, slug)).limit(1);
  return job ?? null;
}

export async function listJobs(filters: JobFilters = {}) {
  const where = buildJobFilters(filters);
  const query = db
    .select({
      id: jobs.id,
      entityId: jobs.entityId,
      entityName: entities.name,
      entitySlug: entities.slug,
      title: jobs.title,
      slug: jobs.slug,
      department: jobs.department,
      location: jobs.location,
      employmentType: jobs.employmentType,
      description: jobs.description,
      responsibilities: jobs.responsibilities,
      requirements: jobs.requirements,
      status: jobs.status,
      createdAt: jobs.createdAt,
      updatedAt: jobs.updatedAt,
    })
    .from(jobs)
    .innerJoin(entities, eq(jobs.entityId, entities.id))
    .$dynamic();

  if (where) query.where(where);

  return query.orderBy(desc(jobs.createdAt));
}

export async function listJobsPaginated(queryInput: AdminJobListQuery) {
  const where = buildJobFilters(queryInput);
  const [{ total }] = await db
    .select({ total: count() })
    .from(jobs)
    .innerJoin(entities, eq(jobs.entityId, entities.id))
    .where(where);
  const rows = await db
    .select({
      id: jobs.id,
      entityId: jobs.entityId,
      entityName: entities.name,
      entitySlug: entities.slug,
      title: jobs.title,
      slug: jobs.slug,
      department: jobs.department,
      location: jobs.location,
      employmentType: jobs.employmentType,
      description: jobs.description,
      responsibilities: jobs.responsibilities,
      requirements: jobs.requirements,
      status: jobs.status,
      createdAt: jobs.createdAt,
      updatedAt: jobs.updatedAt,
    })
    .from(jobs)
    .innerJoin(entities, eq(jobs.entityId, entities.id))
    .where(where)
    .orderBy(jobOrderBy(queryInput))
    .limit(queryInput.pageSize)
    .offset(getOffset(queryInput));

  return createPaginatedResult(rows, total, queryInput);
}

export async function listPublishedJobs(filters: Omit<JobFilters, "status"> = {}) {
  return listJobs({ ...filters, status: "published" });
}

export async function listFeaturedJobs(limit = 6) {
  return db
    .select({
      id: jobs.id,
      entityId: jobs.entityId,
      entityName: entities.name,
      entitySlug: entities.slug,
      title: jobs.title,
      slug: jobs.slug,
      department: jobs.department,
      location: jobs.location,
      employmentType: jobs.employmentType,
      description: jobs.description,
      responsibilities: jobs.responsibilities,
      requirements: jobs.requirements,
      status: jobs.status,
      createdAt: jobs.createdAt,
      updatedAt: jobs.updatedAt,
    })
    .from(jobs)
    .innerJoin(entities, eq(jobs.entityId, entities.id))
    .where(eq(jobs.status, "published"))
    .orderBy(desc(jobs.createdAt))
    .limit(limit);
}

export async function getPublishedJobBySlug(slug: string) {
  const [job] = await db
    .select({
      id: jobs.id,
      entityId: jobs.entityId,
      entityName: entities.name,
      entitySlug: entities.slug,
      title: jobs.title,
      slug: jobs.slug,
      department: jobs.department,
      location: jobs.location,
      employmentType: jobs.employmentType,
      description: jobs.description,
      responsibilities: jobs.responsibilities,
      requirements: jobs.requirements,
      status: jobs.status,
      createdAt: jobs.createdAt,
      updatedAt: jobs.updatedAt,
    })
    .from(jobs)
    .innerJoin(entities, eq(jobs.entityId, entities.id))
    .where(and(eq(jobs.slug, slug), eq(jobs.status, "published")))
    .limit(1);

  return job ?? null;
}

export async function publishJob(id: string) {
  return updateJobStatus(id, "published");
}

export async function closeJob(id: string) {
  return updateJobStatus(id, "closed");
}

async function updateJobStatus(id: string, status: JobStatus) {
  const [job] = await db
    .update(jobs)
    .set({ status, updatedAt: new Date() })
    .where(eq(jobs.id, id))
    .returning();

  return job ?? null;
}
