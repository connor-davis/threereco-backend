import { relations, sql } from "drizzle-orm";
import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import { decimalNumber } from "@/lib/types";

import businesses from "./business";
import collectors from "./collector";
import { products } from "./products";

export const collections = pgTable("collections", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  businessId: uuid("business_id").notNull(),
  collectorId: uuid("collector_id").notNull(),
  productId: uuid("product_id").notNull(),
  weight: decimalNumber("weight").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, precision: 6 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, precision: 6 })
    .defaultNow()
    .notNull(),
});

export const collectionBusiness = relations(collections, ({ one }) => ({
  business: one(businesses, {
    fields: [collections.businessId],
    references: [businesses.id],
  }),
}));

export const businessCollections = relations(businesses, ({ many }) => ({
  collections: many(collections),
}));

export const collectionProduct = relations(collections, ({ one }) => ({
  product: one(products, {
    fields: [collections.productId],
    references: [products.id],
  }),
}));

export const productCollections = relations(products, ({ many }) => ({
  collections: many(collections),
}));

export const collectionCollector = relations(collections, ({ one }) => ({
  collector: one(collectors, {
    fields: [collections.collectorId],
    references: [collectors.id],
  }),
}));

export const collectorCollections = relations(collectors, ({ many }) => ({
  collections: many(collections),
}));