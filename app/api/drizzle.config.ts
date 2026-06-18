import "./_seeds/_env";

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/api/_db/schema/index.ts",
  out: "./app/api/_db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
