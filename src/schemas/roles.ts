import { pgEnum } from "drizzle-orm/pg-core";

export const roles = pgEnum("roles", [
  "System Admin",
  "Admin",
  "Staff",
  "Business",
  "Collector",
]);
