import {
  customType,
  decimal,
  numeric,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

import { businesses } from "./businesses";
import { decimalInt, decimalNumber } from "../utilities/postgres";

export const products = pgTable("products", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  name: text("name").notNull(),
  price: decimalNumber("price").notNull(),
  gwCode: text("gwCode").notNull(),
  carbonFactor: text("carbonFactor").notNull(),
  businessId: uuid("business_id").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
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
