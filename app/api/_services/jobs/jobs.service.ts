import {
  closeJob,
  createJob,
  getJobById,
  getJobBySlug,
  getPublishedJobById,
  getPublishedJobBySlug,
  listFeaturedJobs,
  listJobs,
  listPublishedJobs,
  publishJob,
  updateJob,
} from "@/app/api/_repositories/jobs/jobs.repository";
import type {
  CreateJobInput,
  JobFilters,
  UpdateJobInput,
} from "@/app/api/_schemas/jobs/job.schema";

export async function createJobService(input: CreateJobInput) {
  return createJob(input);
}

export async function updateJobService(id: string, input: UpdateJobInput) {
  return updateJob(id, input);
}

export async function getJobByIdService(id: string) {
  return getJobById(id);
}

export async function getJobBySlugService(slug: string) {
  return getJobBySlug(slug);
}

export async function getPublishedJobByIdService(id: string) {
  return getPublishedJobById(id);
}

export async function listJobsService(filters: JobFilters = {}) {
  return listJobs(filters);
}

export async function listPublishedJobsService(filters: Omit<JobFilters, "status"> = {}) {
  return listPublishedJobs(filters);
}

export async function listFeaturedJobsService(limit = 6) {
  return listFeaturedJobs(limit);
}

export async function getPublishedJobBySlugService(slug: string) {
  return getPublishedJobBySlug(slug);
}

export async function publishJobService(id: string) {
  return publishJob(id);
}

export async function closeJobService(id: string) {
  return closeJob(id);
}
