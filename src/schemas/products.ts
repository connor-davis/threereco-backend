import { z } from "@hono/zod-openapi";

import { relations } from "drizzle-orm";
import { decimal, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import businesses from "./business";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text("name").notNull(),
  price: decimal("price").notNull(),
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

export const selectProductsSchema = createSelectSchema(products);
export const insertProductsSchema = createInsertSchema(products)
  .omit({ businessId: true, id: true, createdAt: true, updatedAt: true })
  .extend({
    businessId: z.string().uuid().optional().nullable(),
  });

export const productBusiness = relations(products, ({ one }) => ({
  business: one(businesses, {
    fields: [products.businessId],
    references: [businesses.id],
  }),
}));

export const businessProducts = relations(businesses, ({ many }) => ({
  products: many(products),
}));
