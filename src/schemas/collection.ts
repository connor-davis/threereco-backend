import { z } from "@hono/zod-openapi";

import { relations } from "drizzle-orm";
import { decimal, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import businesses from "./business";
import collectors from "./collector";
import { products } from "./products";

export const collections = pgTable("collections", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  businessId: uuid("business_id").notNull(),
  collectorId: uuid("collector_id").notNull(),
  productId: uuid("product_id").notNull(),
  weight: decimal("price").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, precision: 6 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, precision: 6 })
    .defaultNow()
    .notNull(),
});

export const selectCollectionsSchema = createSelectSchema(collections);

export const insertCollectionsSchema = createInsertSchema(collections)
  .omit({ businessId: true, id: true, createdAt: true, updatedAt: true })
  .extend({ businessId: z.string().uuid().optional().nullable() });

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
