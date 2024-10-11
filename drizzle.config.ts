import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./src/schemas",
  migrations: {
    prefix: "timestamp",
    schema: "./src/schemas",
    table: "charos_api_migrations",
  },
});
