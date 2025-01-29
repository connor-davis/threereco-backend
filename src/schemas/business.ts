import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import businessTypes from "./businessTypes";
import { selectUsersSchema, users } from "./user";

export const businesses = pgTable("businesses", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text().unique().notNull(),
  type: businessTypes().default("Recycler").notNull(),
  description: text().notNull(),
  phoneNumber: text().notNull(),
  address: text().notNull(),
  city: text().notNull(),
  province: text().notNull(),
  zipCode: text().notNull(),
  userId: uuid().notNull(),
  createdAt: timestamp({ withTimezone: true, precision: 6 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ withTimezone: true, precision: 6 })
    .defaultNow()
    .notNull(),
});

export const selectBusinessesSchema = createSelectSchema(businesses).extend({
  user: selectUsersSchema.optional(),
});

export const insertBusinessesSchema = createInsertSchema(businesses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const businessUser = relations(businesses, ({ one }) => ({
  user: one(users, {
    fields: [businesses.userId],
    references: [users.id],
  }),
}));

export const userBusinesses = relations(users, ({ many }) => ({
  businesses: many(businesses),
}));
