import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

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
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
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
