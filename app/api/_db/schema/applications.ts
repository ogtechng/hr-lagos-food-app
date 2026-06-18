import { pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { jobs } from "./jobs";

export const applicationStatusEnum = pgEnum("application_status", [
  "submitted",
  "accepted",
  "rejected",
]);

export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id")
    .notNull()
    .references(() => jobs.id),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  state: varchar("state", { length: 120 }).notNull(),
  address: text("address").notNull(),
  cvUrl: text("cv_url").notNull(),
  cvFileName: varchar("cv_file_name", { length: 255 }),
  cvStoragePath: text("cv_storage_path"),
  coverLetterUrl: text("cover_letter_url"),
  coverLetterFileName: varchar("cover_letter_file_name", { length: 255 }),
  coverLetterStoragePath: text("cover_letter_storage_path"),
  status: applicationStatusEnum("status").notNull().default("submitted"),
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const applicationStatusEvents = pgTable("application_status_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => applications.id),
  previousStatus: applicationStatusEnum("previous_status"),
  newStatus: applicationStatusEnum("new_status").notNull(),
  note: text("note"),
  changedBy: varchar("changed_by", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type ApplicationStatus = (typeof applicationStatusEnum.enumValues)[number];
export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
export type ApplicationStatusEvent = typeof applicationStatusEvents.$inferSelect;
export type NewApplicationStatusEvent = typeof applicationStatusEvents.$inferInsert;
