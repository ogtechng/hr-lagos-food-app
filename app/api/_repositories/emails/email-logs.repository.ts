import { eq } from "drizzle-orm";

import { db } from "@/app/api/_db";
import { emailLogs, type EmailStatus, type NewEmailLog } from "@/app/api/_db/schema";

export async function createEmailLog(data: NewEmailLog) {
  const [emailLog] = await db.insert(emailLogs).values(data).returning();
  return emailLog;
}

export async function updateEmailLogStatus(id: string, status: EmailStatus, error?: string | null) {
  const [emailLog] = await db
    .update(emailLogs)
    .set({ status, error: error ?? null })
    .where(eq(emailLogs.id, id))
    .returning();

  return emailLog ?? null;
}
