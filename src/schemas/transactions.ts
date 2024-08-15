import { decimal, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

import { collections } from "./collections";

export const transactions = pgTable("transactions", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  collectionId: uuid("collection_id").notNull(),
  weight: decimal("weight").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const transactionsCollection = relations(transactions, ({ one }) => ({
  collection: one(collections, {
    fields: [transactions.collectionId],
    references: [collections.id],
  }),
}));

export const collectionTransactions = relations(collections, ({ many }) => ({
  transactions: many(transactions),
}));
