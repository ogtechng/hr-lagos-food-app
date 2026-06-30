import {
  createEmailLogService,
  updateEmailLogStatusService,
} from "@/app/api/_services/emails/email-logs.service";

interface ApplicationEmailContext {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  jobTitle: string;
  entityName: string;
  hasCoverLetter?: boolean;
}

interface SendEmailInput {
  recipient: string;
  subject: string;
  template: string;
  text: string;
}

/** Recruitment team inbox notified on every new application (override via RECRUITMENT_EMAIL). */
function recruitmentEmail() {
  return process.env.RECRUITMENT_EMAIL ?? "recruitments@ProduceforLagos.com";
}

/** Outbound sender address (override via RESEND_FROM_EMAIL). */
function senderAddress() {
  return (
    process.env.RESEND_FROM_EMAIL ?? "Produce for Lagos Careers <recruitments@ProduceforLagos.com>"
  );
}

async function sendTrackedEmail(input: SendEmailInput) {
  const log = await createEmailLogService({
    recipient: input.recipient,
    subject: input.subject,
    template: input.template,
    status: "pending",
  });

  if (!process.env.RESEND_API_KEY) {
    await updateEmailLogStatusService(log.id, "failed", "RESEND_API_KEY is not configured");
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: senderAddress(),
        to: input.recipient,
        subject: input.subject,
        text: input.text,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(
        `[email] Resend rejected "${input.template}" → ${input.recipient}: ` +
          `${response.status} ${response.statusText} | from=${senderAddress()} | body=${detail}`,
      );
      await updateEmailLogStatusService(
        log.id,
        "failed",
        `Resend ${response.status}: ${detail.slice(0, 480) || response.statusText}`,
      );
      return;
    }

    await updateEmailLogStatusService(log.id, "sent");
  } catch (error) {
    console.error(
      `[email] Resend request threw for "${input.template}" → ${input.recipient}:`,
      error,
    );
    await updateEmailLogStatusService(
      log.id,
      "failed",
      `Email provider request failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function sendApplicationSubmittedEmail(context: ApplicationEmailContext) {
  await sendTrackedEmail({
    recipient: context.applicantEmail,
    subject: "Application received",
    template: "application-submitted",
    text: `Hello ${context.applicantName},

We received your application for ${context.jobTitle} at ${context.entityName}.

The hiring team will review your submission and contact you by email with updates.`,
  });
}

export async function sendAdminNewApplicationEmail(context: ApplicationEmailContext) {
  const recipient = process.env.ADMIN_NOTIFICATION_EMAIL;

  if (!recipient) {
    await createEmailLogService({
      recipient: "admin-notification-not-configured",
      subject: "New job application received",
      template: "admin-new-application",
      status: "failed",
      error: "ADMIN_NOTIFICATION_EMAIL is not configured",
    });
    return;
  }

  await sendTrackedEmail({
    recipient,
    subject: "New job application received",
    template: "admin-new-application",
    text: newApplicationBody(context),
  });
}

export async function sendRecruitmentNewApplicationEmail(context: ApplicationEmailContext) {
  await sendTrackedEmail({
    recipient: recruitmentEmail(),
    subject: `New application: ${context.jobTitle}`,
    template: "recruitment-new-application",
    text: newApplicationBody(context),
  });
}

function newApplicationBody(context: ApplicationEmailContext) {
  return `New application received.

Applicant: ${context.applicantName}
Email: ${context.applicantEmail}
Phone: ${context.applicantPhone}
Job: ${context.jobTitle}
Entity: ${context.entityName}
Cover letter: ${context.hasCoverLetter ? "Attached" : "Not provided"}`;
}

export async function sendApplicationAcceptedEmail(context: ApplicationEmailContext) {
  await sendTrackedEmail({
    recipient: context.applicantEmail,
    subject: "Application update",
    template: "application-accepted",
    text: `Hello ${context.applicantName},

Your application for ${context.jobTitle} at ${context.entityName} has been accepted.

The hiring team will contact you with the next steps.`,
  });
}

export async function sendApplicationRejectedEmail(context: ApplicationEmailContext) {
  await sendTrackedEmail({
    recipient: context.applicantEmail,
    subject: "Application update",
    template: "application-rejected",
    text: `Hello ${context.applicantName},

Thank you for applying for ${context.jobTitle} at ${context.entityName}.

The hiring team has reviewed your application and will not be moving forward at this time.`,
  });
}
