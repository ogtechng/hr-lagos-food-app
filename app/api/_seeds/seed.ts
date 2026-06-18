import "./_env";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../_db/schema";

const { entities, jobs, applications, applicationStatusEvents, emailLogs } = schema;

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL ?? "admin@example.com";
const CV_PLACEHOLDER = "https://storage.example.com/cvs/seed-sample-cv.pdf";

const ENTITY_SEED = [
  {
    name: "P4L",
    slug: "p4l",
    description: "Last-mile delivery and logistics arm of the My Lagos Food group.",
    isActive: true,
  },
  {
    name: "My Lagos Food App",
    slug: "my-lagos-food-app",
    description: "Flagship consumer food-ordering platform serving Lagos.",
    isActive: true,
  },
  {
    name: "BulkFood",
    slug: "bulkfood",
    description: "Wholesale and bulk food distribution business.",
    isActive: true,
  },
  {
    name: "Legacy Foods",
    slug: "legacy-foods",
    description: "Dormant entity kept for historical records.",
    isActive: false,
  },
];

type JobSeed = {
  slug: string;
  entitySlug: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  status: "draft" | "published" | "closed";
  description: string;
  responsibilities: string;
  requirements: string;
};

const JOB_SEED: JobSeed[] = [
  {
    slug: "delivery-rider-p4l",
    entitySlug: "p4l",
    title: "Delivery Rider",
    department: "Logistics",
    location: "Lagos",
    employmentType: "Full-time",
    status: "published",
    description: "Deliver customer orders quickly and safely across Lagos.",
    responsibilities: "Pick up and deliver orders; keep delivery times within SLA.",
    requirements: "Valid rider's permit; familiarity with Lagos routes.",
  },
  {
    slug: "operations-associate-p4l",
    entitySlug: "p4l",
    title: "Operations Associate",
    department: "Operations",
    location: "Lagos",
    employmentType: "Full-time",
    status: "published",
    description: "Coordinate daily dispatch operations and rider scheduling.",
    responsibilities: "Plan routes; monitor rider performance; resolve delivery issues.",
    requirements: "1+ year in operations or logistics; strong organisation skills.",
  },
  {
    slug: "dispatch-manager-p4l",
    entitySlug: "p4l",
    title: "Dispatch Manager",
    department: "Logistics",
    location: "Lagos",
    employmentType: "Full-time",
    status: "closed",
    description: "Own the dispatch function end to end.",
    responsibilities: "Manage the rider fleet and dispatch KPIs.",
    requirements: "3+ years managing logistics teams.",
  },
  {
    slug: "frontend-engineer-mlfa",
    entitySlug: "my-lagos-food-app",
    title: "Frontend Engineer",
    department: "Engineering",
    location: "Remote (Lagos)",
    employmentType: "Full-time",
    status: "published",
    description: "Build delightful ordering experiences in Next.js.",
    responsibilities: "Ship features; collaborate with design; maintain quality.",
    requirements: "Strong React/TypeScript; 2+ years experience.",
  },
  {
    slug: "customer-support-mlfa",
    entitySlug: "my-lagos-food-app",
    title: "Customer Support Agent",
    department: "Support",
    location: "Lagos",
    employmentType: "Contract",
    status: "published",
    description: "Help customers resolve order issues over chat and phone.",
    responsibilities: "Respond to tickets; escalate where needed; keep CSAT high.",
    requirements: "Excellent communication; prior support experience a plus.",
  },
  {
    slug: "warehouse-supervisor-bulkfood",
    entitySlug: "bulkfood",
    title: "Warehouse Supervisor",
    department: "Warehouse",
    location: "Ogun",
    employmentType: "Full-time",
    status: "published",
    description: "Supervise inbound and outbound warehouse operations.",
    responsibilities: "Manage stock accuracy; supervise warehouse staff.",
    requirements: "2+ years in warehouse operations.",
  },
  {
    slug: "procurement-officer-bulkfood",
    entitySlug: "bulkfood",
    title: "Procurement Officer",
    department: "Procurement",
    location: "Lagos",
    employmentType: "Full-time",
    status: "draft",
    description: "Source produce and negotiate with suppliers.",
    responsibilities: "Manage supplier relationships; control procurement costs.",
    requirements: "Procurement experience in FMCG or food.",
  },
];

type AppSeed = {
  jobSlug: string;
  name: string;
  phone: string;
  email: string;
  state: string;
  address: string;
  status: "submitted" | "accepted" | "rejected";
  adminNote?: string;
};

const APPLICATION_SEED: AppSeed[] = [
  {
    jobSlug: "delivery-rider-p4l",
    name: "Adaeze Okafor",
    phone: "+2348012345678",
    email: "adaeze@example.com",
    state: "Lagos",
    address: "12 Marina Road, Lagos Island",
    status: "submitted",
  },
  {
    jobSlug: "frontend-engineer-mlfa",
    name: "Chidi Eze",
    phone: "+2348023456789",
    email: "chidi@example.com",
    state: "Lagos",
    address: "5 Allen Avenue, Ikeja",
    status: "accepted",
    adminNote: "Strong portfolio, moved to offer stage.",
  },
  {
    jobSlug: "warehouse-supervisor-bulkfood",
    name: "Ngozi Bello",
    phone: "+2348034567890",
    email: "ngozi@example.com",
    state: "Ogun",
    address: "Km 8 Abeokuta Expressway",
    status: "rejected",
    adminNote: "Insufficient warehouse leadership experience.",
  },
  {
    jobSlug: "customer-support-mlfa",
    name: "Tunde Balogun",
    phone: "+2348045678901",
    email: "tunde@example.com",
    state: "Oyo",
    address: "23 Ring Road, Ibadan",
    status: "submitted",
  },
  {
    jobSlug: "operations-associate-p4l",
    name: "Fatima Yusuf",
    phone: "+2348056789012",
    email: "fatima@example.com",
    state: "FCT",
    address: "Plot 7 Wuse II, Abuja",
    status: "submitted",
  },
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not configured (.env.local)");
  }

  const client = postgres(url, { max: 1 });
  const db = drizzle(client, { schema });

  try {
    console.log("Seeding entities...");
    await db.insert(entities).values(ENTITY_SEED).onConflictDoNothing({ target: entities.slug });
    const entityRows = await db.select().from(entities);
    const entityIdBySlug = new Map(entityRows.map((e) => [e.slug, e.id]));

    console.log("Seeding jobs...");
    await db
      .insert(jobs)
      .values(
        JOB_SEED.map((job) => ({
          entityId: entityIdBySlug.get(job.entitySlug)!,
          title: job.title,
          slug: job.slug,
          department: job.department,
          location: job.location,
          employmentType: job.employmentType,
          description: job.description,
          responsibilities: job.responsibilities,
          requirements: job.requirements,
          status: job.status,
        })),
      )
      .onConflictDoNothing({ target: jobs.slug });
    const jobRows = await db.select().from(jobs);
    const jobIdBySlug = new Map(jobRows.map((j) => [j.slug, j.id]));

    // Reset transactional tables so re-running gives a known, duplicate-free state.
    console.log("Resetting applications, status events, and email logs...");
    await db.delete(applicationStatusEvents);
    await db.delete(applications);
    await db.delete(emailLogs);

    console.log("Seeding applications...");
    const insertedApps = await db
      .insert(applications)
      .values(
        APPLICATION_SEED.map((app) => ({
          jobId: jobIdBySlug.get(app.jobSlug)!,
          name: app.name,
          phone: app.phone,
          email: app.email,
          state: app.state,
          address: app.address,
          cvUrl: CV_PLACEHOLDER,
          cvFileName: `${app.name.toLowerCase().replaceAll(" ", "-")}-cv.pdf`,
          cvStoragePath: null,
          status: app.status,
          adminNote: app.adminNote ?? null,
        })),
      )
      .returning({ id: applications.id, email: applications.email, status: applications.status });

    console.log("Seeding application status events...");
    const events = insertedApps.flatMap((app) => {
      const base = {
        applicationId: app.id,
        previousStatus: null,
        newStatus: "submitted" as const,
        note: "Application submitted",
        changedBy: null,
      };
      if (app.status === "submitted") {
        return [base];
      }
      return [
        base,
        {
          applicationId: app.id,
          previousStatus: "submitted" as const,
          newStatus: app.status,
          note: app.status === "accepted" ? "Moved to offer" : "Not progressing",
          changedBy: "admin",
        },
      ];
    });
    await db.insert(applicationStatusEvents).values(events);

    console.log("Seeding email logs...");
    await db.insert(emailLogs).values([
      {
        recipient: "adaeze@example.com",
        subject: "Application received",
        template: "application-submitted",
        status: "sent",
      },
      {
        recipient: ADMIN_EMAIL,
        subject: "New job application received",
        template: "admin-new-application",
        status: "sent",
      },
      {
        recipient: "chidi@example.com",
        subject: "Application update",
        template: "application-accepted",
        status: "sent",
      },
      {
        recipient: "ngozi@example.com",
        subject: "Application update",
        template: "application-rejected",
        status: "sent",
      },
      {
        recipient: "tunde@example.com",
        subject: "Application received",
        template: "application-submitted",
        status: "failed",
        error: "RESEND_API_KEY is not configured",
      },
    ]);

    console.log("\nSeed complete:");
    console.log(`  entities: ${entityRows.length}`);
    console.log(`  jobs: ${jobRows.length}`);
    console.log(`  applications: ${insertedApps.length}`);
    console.log(`  status events: ${events.length}`);
    console.log(`  email logs: 5`);
  } finally {
    await client.end();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
