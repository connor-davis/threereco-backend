import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { selectUsersSchema, users } from "./user";

export const collectors = pgTable("collectors", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  firstName: text().notNull(),
  lastName: text().notNull(),
  idNumber: text().notNull(),
  phoneNumber: text().notNull(),
  address: text().notNull(),
  city: text().notNull(),
  province: text().notNull(),
  zipCode: text().notNull(),
  bankName: text().notNull(),
  bankAccountHolder: text().notNull(),
  bankAccountNumber: text().notNull(),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp({ withTimezone: true, precision: 6 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ withTimezone: true, precision: 6 })
    .defaultNow()
    .notNull(),
});

export const selectCollectorsSchema = createSelectSchema(collectors).extend({
  user: selectUsersSchema.optional(),
});

export const insertCollectorsSchema = createInsertSchema(collectors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const collectorUser = relations(collectors, ({ one }) => ({
  user: one(users, {
    fields: [collectors.userId],
    references: [users.id],
  }),
}));

export const userCollectors = relations(users, ({ many }) => ({
  collectors: many(collectors),
}));
