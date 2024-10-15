import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import roles from "./roles";

const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  email: varchar("email", {
    length: 255,
  }).notNull(),
  password: varchar("password", {
    length: 255,
  }).notNull(),
  active: boolean("active").default(true).notNull(),
  role: roles("role").default("customer").notNull(),
  mfaSecret: varchar("mfa_secret", {
    length: 255,
  }),
  mfaEnabled: boolean("mfa_enabled").default(false).notNull(),
  mfaVerified: boolean("mfa_verified").default(false).notNull(),
  createdAt: timestamp("created_at", {
    mode: "string",
    precision: 6,
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: "string",
    precision: 6,
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export const selectUsersSchema = createSelectSchema(users).omit({
  password: true,
  mfaSecret: true,
});
export const insertUsersSchema = createInsertSchema(users);

export const loginUsersSchema = insertUsersSchema.pick({
  email: true,
  password: true,
});

export const registerUsersSchema = insertUsersSchema.pick({
  email: true,
  password: true,
});

export const createUsersSchema = insertUsersSchema.pick({
  email: true,
  password: true,
  role: true,
});

export const updateUsersSchema = insertUsersSchema.pick({
  email: true,
  role: true,
});

export default users;
