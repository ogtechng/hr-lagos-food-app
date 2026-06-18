import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

function assertDatabaseUrl(value: string | undefined) {
  if (!value) {
    throw new Error("DATABASE_URL is not configured");
  }

  try {
    const url = new URL(value);
    if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
      throw new Error("Invalid protocol");
    }
  } catch {
    throw new Error("DATABASE_URL is not a valid PostgreSQL connection string");
  }

  return value;
}

function createDb() {
  const connectionString = assertDatabaseUrl(process.env.DATABASE_URL);
  const client = postgres(connectionString);
  return drizzle(client, { schema });
}

type DbClient = ReturnType<typeof createDb>;

let cachedDb: DbClient | null = null;

function getDb() {
  cachedDb ??= createDb();
  return cachedDb;
}

export const db = new Proxy({} as DbClient, {
  get(_target, property, receiver) {
    return Reflect.get(getDb(), property, receiver);
  },
});
