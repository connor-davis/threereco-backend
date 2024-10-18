import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import businessTypes from "./businessTypes";
import users, { selectUsersSchema } from "./user";

const businesses = pgTable("businesses", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text("name").unique().notNull(),
  type: businessTypes("type").default("Recycler").notNull(),
  description: text("description").notNull(),
  phoneNumber: text("phone_number").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  zipCode: text("zip_code").notNull(),
  userId: uuid("user_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, precision: 6 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, precision: 6 })
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

export default businesses;
