import {
  createApplication,
  createApplicationStatusEvent,
  getApplicationDetailById,
  getApplicationById,
  listApplicationStatusEvents,
  listApplications,
  updateApplicationAdminNote,
  updateApplicationStatus,
} from "@/app/api/_repositories/applications/applications.repository";
import { getPublishedJobByIdService } from "@/app/api/_services/jobs/jobs.service";
import {
  sendAdminNewApplicationEmail,
  sendApplicationAcceptedEmail,
  sendApplicationRejectedEmail,
  sendApplicationSubmittedEmail,
  sendRecruitmentNewApplicationEmail,
} from "@/app/api/_services/emails/application-emails.service";
import { uploadCoverLetterFile, uploadCvFile } from "@/app/api/_services/upload/cv-upload.service";
import type {
  ApplicationFilters,
  CreateApplicationInput,
  PublicApplicationFormInput,
  UpdateApplicationStatusInput,
} from "@/app/api/_schemas/applications/application.schema";

export async function createApplicationService(input: CreateApplicationInput) {
  const application = await createApplication(input);

  await createApplicationStatusEvent({
    applicationId: application.id,
    previousStatus: null,
    newStatus: application.status,
    note: "Application submitted",
    changedBy: null,
  });

  return application;
}

export async function createApplicationForJob(
  input: PublicApplicationFormInput,
  cvFile: File,
  coverLetterFile?: File | null,
) {
  // Future hardening: add abuse prevention/rate limiting for repeated public submissions.
  const job = await getPublishedJobByIdService(input.jobId);

  if (!job) {
    throw new Error("Job not found");
  }

  const uploadedCv = await uploadCvFile(cvFile);
  const uploadedCoverLetter = coverLetterFile ? await uploadCoverLetterFile(coverLetterFile) : null;

  const application = await createApplicationService({
    jobId: input.jobId,
    name: input.name,
    phone: input.phone,
    email: input.email,
    state: input.state,
    address: input.address,
    cvUrl: uploadedCv.cvUrl,
    cvFileName: uploadedCv.cvFileName,
    cvStoragePath: uploadedCv.storagePath,
    coverLetterUrl: uploadedCoverLetter?.coverLetterUrl ?? null,
    coverLetterFileName: uploadedCoverLetter?.coverLetterFileName ?? null,
    coverLetterStoragePath: uploadedCoverLetter?.storagePath ?? null,
  });

  const emailContext = {
    applicantName: input.name,
    applicantEmail: input.email,
    applicantPhone: input.phone,
    jobTitle: job.title,
    entityName: job.entityName,
    hasCoverLetter: Boolean(uploadedCoverLetter),
  };

  await Promise.allSettled([
    sendApplicationSubmittedEmail(emailContext),
    sendAdminNewApplicationEmail(emailContext),
    sendRecruitmentNewApplicationEmail(emailContext),
  ]);

  return { application, job };
}

export async function getApplicationByIdService(id: string) {
  return getApplicationById(id);
}

export async function getApplicationDetailByIdService(id: string) {
  return getApplicationDetailById(id);
}

export async function listApplicationStatusEventsService(applicationId: string) {
  return listApplicationStatusEvents(applicationId);
}

export async function listApplicationsService(filters: ApplicationFilters = {}) {
  return listApplications(filters);
}

export async function updateApplicationStatusService(
  id: string,
  input: UpdateApplicationStatusInput,
) {
  const currentApplication = await getApplicationById(id);

  if (!currentApplication) {
    return null;
  }

  const application = await updateApplicationStatus(id, input.status);

  await createApplicationStatusEvent({
    applicationId: id,
    previousStatus: currentApplication.status,
    newStatus: input.status,
    note: input.note ?? null,
    changedBy: input.changedBy ?? null,
  });

  if (input.note !== undefined) {
    await updateApplicationAdminNote(id, input.note);
  }

  const detail = await getApplicationDetailById(id);

  if (detail) {
    const emailContext = {
      applicantName: detail.name,
      applicantEmail: detail.email,
      applicantPhone: detail.phone,
      jobTitle: detail.jobTitle,
      entityName: detail.entityName,
    };

    await Promise.allSettled([
      input.status === "accepted"
        ? sendApplicationAcceptedEmail(emailContext)
        : sendApplicationRejectedEmail(emailContext),
    ]);
  }

  return application;
}

export async function updateApplicationAdminNoteService(id: string, adminNote: string | null) {
  return updateApplicationAdminNote(id, adminNote);
}
