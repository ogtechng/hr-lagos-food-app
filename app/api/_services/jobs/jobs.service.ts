import {
  closeJob,
  createJob,
  getJobById,
  getJobBySlug,
  getPublishedJobById,
  getPublishedJobBySlug,
  listFeaturedJobs,
  listJobs,
  listJobsPaginated,
  listPublishedJobs,
  publishJob,
  updateJob,
} from "@/app/api/_repositories/jobs/jobs.repository";
import type {
  AdminJobListQuery,
  CreateJobInput,
  JobFilters,
  UpdateJobInput,
} from "@/app/api/_schemas/jobs/job.schema";
import { sanitizeRichText } from "@/app/api/_services/rich-text/rich-text.service";
import { slugify } from "@/lib/utils";

export async function createJobService(input: CreateJobInput) {
  const slug = await createUniqueJobSlug(input.title);
  return createJob({
    ...sanitizeJobInput(input),
    slug,
  });
}

export async function updateJobService(id: string, input: UpdateJobInput) {
  return updateJob(id, sanitizeJobInput(input));
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

export async function listJobsPaginatedService(query: AdminJobListQuery) {
  return listJobsPaginated(query);
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

function sanitizeJobInput<T extends CreateJobInput | UpdateJobInput>(input: T) {
  return {
    ...input,
    description:
      "description" in input ? sanitizeRichText(input.description) : input.description,
    responsibilities:
      "responsibilities" in input ? sanitizeRichText(input.responsibilities) : input.responsibilities,
    requirements:
      "requirements" in input ? sanitizeRichText(input.requirements) : input.requirements,
  };
}

async function createUniqueJobSlug(title: string) {
  const baseSlug = slugify(title) || "job";
  let slug = baseSlug;
  let suffix = 2;

  while (await getJobBySlug(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}
