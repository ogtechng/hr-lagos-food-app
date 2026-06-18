import { pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { entities } from "./entities";

export const jobStatusEnum = pgEnum("job_status", ["draft", "published", "closed"]);

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  entityId: uuid("entity_id")
    .notNull()
    .references(() => entities.id),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  department: varchar("department", { length: 255 }),
  location: varchar("location", { length: 255 }).notNull(),
  employmentType: varchar("employment_type", { length: 100 }),
  description: text("description"),
  responsibilities: text("responsibilities"),
  requirements: text("requirements"),
  status: jobStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type JobStatus = (typeof jobStatusEnum.enumValues)[number];
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
