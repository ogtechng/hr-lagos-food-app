import {
  createEmailLog,
  updateEmailLogStatus,
} from "@/app/api/_repositories/emails/email-logs.repository";
import type { EmailStatus, NewEmailLog } from "@/app/api/_db/schema";

export async function createEmailLogService(input: NewEmailLog) {
  return createEmailLog(input);
}

export async function updateEmailLogStatusService(
  id: string,
  status: EmailStatus,
  error?: string | null,
) {
  return updateEmailLogStatus(id, status, error);
}
