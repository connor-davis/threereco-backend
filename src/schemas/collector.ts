import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import users from "./user";

const collectors = pgTable("collectors", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  idNumber: text("id_number").notNull(),
  phoneNumber: text("phone_number").notNull(),
  address: text("address").notNull(),
  city: text("city"),
  province: text("province"),
  zipCode: text("zip_code"),
  bankName: text("bank_name").notNull(),
  bankAccountHolder: text("bank_account_holder").notNull(),
  bankAccountNumber: text("bank_account_number").notNull(),
  userId: uuid("user_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, precision: 6 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, precision: 6 })
    .defaultNow()
    .notNull(),
});

export const selectCollectorsSchema = createSelectSchema(collectors);
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

export default collectors;
