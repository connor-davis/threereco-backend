import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";
import { roles } from "./roles";

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
  createdAt: timestamp("created_at", { withTimezone: true, precision: 6 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, precision: 6 })
    .defaultNow()
    .notNull(),
});
