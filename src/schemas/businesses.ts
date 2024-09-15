import { relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { businessTypes } from "./businessTypes";
import { users } from "./users";

export const businesses = pgTable("businesses", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  name: text("name").unique().notNull(),
  type: businessTypes("type").default("Recycler").notNull(),
  description: text("description"),
  phoneNumber: text("phone_number"),
  address: text("address"),
  city: text("city"),
  province: text("province"),
  zipCode: text("zip_code"),
  userId: uuid("user_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, precision: 6 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, precision: 6 })
    .defaultNow()
    .notNull(),
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
