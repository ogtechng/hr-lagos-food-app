import { and, desc, eq, gte, ilike, lte, or, type SQL } from "drizzle-orm";

import { db } from "@/app/api/_db";
import {
  applicationStatusEvents,
  applications,
  entities,
  jobs,
  type ApplicationStatus,
  type NewApplication,
  type NewApplicationStatusEvent,
} from "@/app/api/_db/schema";
import type { ApplicationFilters } from "@/app/api/_schemas/applications/application.schema";

function buildApplicationFilters(filters: ApplicationFilters = {}) {
  const conditions: SQL[] = [];

  if (filters.jobId) conditions.push(eq(applications.jobId, filters.jobId));
  if (filters.entityId) conditions.push(eq(jobs.entityId, filters.entityId));
  if (filters.status) conditions.push(eq(applications.status, filters.status));
  if (filters.email) conditions.push(eq(applications.email, filters.email));
  if (filters.createdFrom) conditions.push(gte(applications.createdAt, filters.createdFrom));
  if (filters.createdTo) conditions.push(lte(applications.createdAt, filters.createdTo));
  if (filters.search) {
    const search = `%${filters.search}%`;
    conditions.push(
      or(
        ilike(applications.name, search),
        ilike(applications.email, search),
        ilike(applications.phone, search),
      )!,
    );
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
}

export async function createApplication(data: NewApplication) {
  const [application] = await db.insert(applications).values(data).returning();
  return application;
}

export async function getApplicationById(id: string) {
  const [application] = await db
    .select()
    .from(applications)
    .where(eq(applications.id, id))
    .limit(1);
  return application ?? null;
}

export async function listApplications(filters: ApplicationFilters = {}) {
  const where = buildApplicationFilters(filters);
  const query = db
    .select({
      id: applications.id,
      jobId: applications.jobId,
      jobTitle: jobs.title,
      entityId: jobs.entityId,
      entityName: entities.name,
      name: applications.name,
      phone: applications.phone,
      email: applications.email,
      state: applications.state,
      address: applications.address,
      cvUrl: applications.cvUrl,
      cvFileName: applications.cvFileName,
      cvStoragePath: applications.cvStoragePath,
      coverLetterUrl: applications.coverLetterUrl,
      coverLetterFileName: applications.coverLetterFileName,
      coverLetterStoragePath: applications.coverLetterStoragePath,
      status: applications.status,
      adminNote: applications.adminNote,
      createdAt: applications.createdAt,
      updatedAt: applications.updatedAt,
    })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .innerJoin(entities, eq(jobs.entityId, entities.id))
    .$dynamic();

  if (where) query.where(where);

  return query.orderBy(desc(applications.createdAt));
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  const [application] = await db
    .update(applications)
    .set({ status, updatedAt: new Date() })
    .where(eq(applications.id, id))
    .returning();

  return application ?? null;
}

export async function updateApplicationAdminNote(id: string, adminNote: string | null) {
  const [application] = await db
    .update(applications)
    .set({ adminNote, updatedAt: new Date() })
    .where(eq(applications.id, id))
    .returning();

  return application ?? null;
}

export async function getApplicationDetailById(id: string) {
  const [application] = await db
    .select({
      id: applications.id,
      jobId: applications.jobId,
      jobTitle: jobs.title,
      entityId: jobs.entityId,
      entityName: entities.name,
      name: applications.name,
      phone: applications.phone,
      email: applications.email,
      state: applications.state,
      address: applications.address,
      cvUrl: applications.cvUrl,
      cvFileName: applications.cvFileName,
      cvStoragePath: applications.cvStoragePath,
      coverLetterUrl: applications.coverLetterUrl,
      coverLetterFileName: applications.coverLetterFileName,
      coverLetterStoragePath: applications.coverLetterStoragePath,
      status: applications.status,
      adminNote: applications.adminNote,
      createdAt: applications.createdAt,
      updatedAt: applications.updatedAt,
    })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .innerJoin(entities, eq(jobs.entityId, entities.id))
    .where(eq(applications.id, id))
    .limit(1);

  return application ?? null;
}

export async function createApplicationStatusEvent(data: NewApplicationStatusEvent) {
  const [event] = await db.insert(applicationStatusEvents).values(data).returning();
  return event;
}

export async function listApplicationStatusEvents(applicationId: string) {
  return db
    .select()
    .from(applicationStatusEvents)
    .where(eq(applicationStatusEvents.applicationId, applicationId))
    .orderBy(desc(applicationStatusEvents.createdAt));
}
