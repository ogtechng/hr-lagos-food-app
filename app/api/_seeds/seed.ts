import "./_env";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../_db/schema";

const { entities, departments, jobs, applications, applicationStatusEvents, emailLogs } = schema;

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL ?? "admin@example.com";
const CV_PLACEHOLDER = "https://storage.example.com/cvs/seed-sample-cv.pdf";

const ENTITY_SEED = [
  {
    name: "LAFSINCO",
    slug: "lafsinco",
    description: "Food systems infrastructure company for Lagos markets, hubs, and cold-chain.",
    isActive: true,
  },
  {
    name: "BulkFood",
    slug: "bulkfood",
    description: "Commercial engine for structured food trading and bulk procurement.",
    isActive: true,
  },
  {
    name: "EkoLog",
    slug: "ekolog",
    description: "Technology-enabled logistics backbone for food movement into Lagos.",
    isActive: true,
  },
  {
    name: "Produce for Lagos Fund",
    slug: "p4l-fund",
    description: "Financing platform for food security, trading liquidity, and infrastructure.",
    isActive: true,
  },
  {
    name: "Legacy Foods",
    slug: "legacy-foods",
    description: "Dormant entity kept for historical records.",
    isActive: false,
  },
];

const DEPARTMENT_SEED = [
  { name: "Investment & Finance", slug: "investment-finance" },
  { name: "Engineering & Infrastructure", slug: "engineering-infrastructure" },
  { name: "Supply Chain & Logistics", slug: "supply-chain-logistics" },
  { name: "Technology & Data", slug: "technology-data" },
  { name: "Agriculture & Food Systems", slug: "agriculture-food-systems" },
  { name: "Commercial & Trading", slug: "commercial-trading" },
  { name: "Operations", slug: "operations" },
  { name: "Strategy & Transformation", slug: "strategy-transformation" },
  { name: "Marketing & Communications", slug: "marketing-communications" },
  { name: "Corporate Services", slug: "corporate-services" },
  { name: "Legal & Governance", slug: "legal-governance" },
] as const;

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
    slug: "infrastructure-project-manager-lafsinco",
    entitySlug: "lafsinco",
    title: "Infrastructure Project Manager",
    department: "Engineering & Infrastructure",
    location: "Lagos",
    employmentType: "Full-time",
    status: "published",
    description: "Coordinate market, hub, and cold-chain infrastructure delivery for Lagos.",
    responsibilities: "Track project milestones; coordinate contractors; report delivery risks.",
    requirements: "Infrastructure delivery experience; strong project controls discipline.",
  },
  {
    slug: "operations-associate-bulkfood",
    entitySlug: "bulkfood",
    title: "Operations Associate",
    department: "Operations",
    location: "Lagos",
    employmentType: "Full-time",
    status: "published",
    description: "Coordinate daily structured trading operations across food categories.",
    responsibilities: "Monitor order flow; resolve operating issues; coordinate trading partners.",
    requirements: "1+ year in operations; strong organisation and stakeholder skills.",
  },
  {
    slug: "fleet-standards-manager-ekolog",
    entitySlug: "ekolog",
    title: "Fleet Standards Manager",
    department: "Supply Chain & Logistics",
    location: "Lagos",
    employmentType: "Full-time",
    status: "closed",
    description: "Standardise owned and third-party food transport operations.",
    responsibilities: "Manage transporter performance; enforce safety and traceability standards.",
    requirements: "3+ years managing logistics or fleet operations.",
  },
  {
    slug: "data-platform-engineer-ekolog",
    entitySlug: "ekolog",
    title: "Data Platform Engineer",
    department: "Technology & Data",
    location: "Remote (Lagos)",
    employmentType: "Full-time",
    status: "published",
    description: "Build data tools for traceability, performance monitoring, and logistics planning.",
    responsibilities: "Ship product features; maintain data quality; support operational reporting.",
    requirements: "Strong TypeScript and data modelling experience.",
  },
  {
    slug: "communications-lead-p4l-fund",
    entitySlug: "p4l-fund",
    title: "Communications Lead",
    department: "Marketing & Communications",
    location: "Lagos",
    employmentType: "Contract",
    status: "published",
    description: "Shape stakeholder communications for food-security financing initiatives.",
    responsibilities: "Write updates; coordinate campaigns; manage partner communications.",
    requirements: "Excellent writing; prior public-private initiative experience is a plus.",
  },
  {
    slug: "commodity-trading-analyst-bulkfood",
    entitySlug: "bulkfood",
    title: "Commodity Trading Analyst",
    department: "Commercial & Trading",
    location: "Ogun",
    employmentType: "Full-time",
    status: "published",
    description: "Support structured procurement, demand aggregation, and food trading decisions.",
    responsibilities: "Analyse pricing; monitor supplier performance; prepare trading reports.",
    requirements: "Commercial analysis experience in food, FMCG, or commodities.",
  },
  {
    slug: "investment-associate-p4l-fund",
    entitySlug: "p4l-fund",
    title: "Investment Associate",
    department: "Investment & Finance",
    location: "Lagos",
    employmentType: "Full-time",
    status: "draft",
    description: "Support financing structures for strategic food-system investments.",
    responsibilities: "Model transactions; prepare investment memos; monitor portfolio activity.",
    requirements: "Investment analysis or project finance experience.",
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
    jobSlug: "infrastructure-project-manager-lafsinco",
    name: "Adaeze Okafor",
    phone: "+2348012345678",
    email: "adaeze@example.com",
    state: "Lagos",
    address: "12 Marina Road, Lagos Island",
    status: "submitted",
  },
  {
    jobSlug: "data-platform-engineer-ekolog",
    name: "Chidi Eze",
    phone: "+2348023456789",
    email: "chidi@example.com",
    state: "Lagos",
    address: "5 Allen Avenue, Ikeja",
    status: "accepted",
    adminNote: "Strong portfolio, moved to offer stage.",
  },
  {
    jobSlug: "commodity-trading-analyst-bulkfood",
    name: "Ngozi Bello",
    phone: "+2348034567890",
    email: "ngozi@example.com",
    state: "Ogun",
    address: "Km 8 Abeokuta Expressway",
    status: "rejected",
    adminNote: "Insufficient warehouse leadership experience.",
  },
  {
    jobSlug: "communications-lead-p4l-fund",
    name: "Tunde Balogun",
    phone: "+2348045678901",
    email: "tunde@example.com",
    state: "Oyo",
    address: "23 Ring Road, Ibadan",
    status: "submitted",
  },
  {
    jobSlug: "operations-associate-bulkfood",
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

    console.log("Seeding departments...");
    await db
      .insert(departments)
      .values(
        DEPARTMENT_SEED.map((department) => ({
          name: department.name,
          slug: department.slug,
          entityId: null,
          isActive: true,
        })),
      )
      .onConflictDoNothing({ target: departments.slug });

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
