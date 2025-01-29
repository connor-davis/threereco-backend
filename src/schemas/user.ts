import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import roles from "./roles";

export const users = pgTable("users", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  email: varchar({
    length: 255,
  }).notNull(),
  password: varchar({
    length: 255,
  }).notNull(),
  active: boolean().default(true).notNull(),
  role: roles().default("collector").notNull(),
  mfaSecret: varchar({
    length: 255,
  }),
  mfaEnabled: boolean().default(false).notNull(),
  mfaVerified: boolean().default(false).notNull(),
  createdAt: timestamp({
    mode: "string",
    precision: 6,
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp({
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
  mfaEnabled: true,
});
