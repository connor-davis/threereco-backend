import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "../schemas";

const migrationClient = postgres(process.env.DATABASE_URL ?? "", { max: 1 });

export const runMigrations = () =>
  migrate(drizzle(migrationClient), {
    migrationsFolder: "./drizzle",
    migrationsSchema: "public",
    migrationsTable: "migrations",
  });

const queryClient = postgres(process.env.DATABASE_URL ?? "");
const db = drizzle(queryClient, { schema: schema });

export default db;
