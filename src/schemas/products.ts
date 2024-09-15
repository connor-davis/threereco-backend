import { relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { decimalNumber } from "../utilities/postgres";
import { businesses } from "./businesses";

export const products = pgTable("products", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  name: text("name").notNull(),
  price: decimalNumber("price").notNull(),
  gwCode: text("gwCode").notNull(),
  carbonFactor: text("carbonFactor").notNull(),
  businessId: uuid("business_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, precision: 6 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, precision: 6 })
    .defaultNow()
    .notNull(),
});

export const productsBusiness = relations(products, ({ one }) => ({
  business: one(businesses, {
    fields: [products.businessId],
    references: [businesses.id],
  }),
}));

export const businessProducts = relations(businesses, ({ many }) => ({
  products: many(products),
}));
