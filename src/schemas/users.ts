import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { roles } from "./roles";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuid_generate_v4()`)
    .notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  role: roles("role").default("Collector").notNull(),
  active: boolean("active").default(true).notNull(),
  mfaEnabled: boolean("mfa_enabled").default(false).notNull(),
  mfaVerified: boolean("mfa_verified").default(false).notNull(),
  mfaSecret: text("mfa_secret"),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
