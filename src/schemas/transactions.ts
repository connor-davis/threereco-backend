import { decimal, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

import { businesses } from "./businesses";

export const transactions = pgTable("transactions", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  buyerId: uuid("buyer_id").notNull(),
  sellerId: uuid("seller_id").notNull(),
  productId: uuid("product_id").notNull(),
  weight: decimal("weight").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const transactionsBuyer = relations(transactions, ({ one }) => ({
  buyer: one(businesses, {
    fields: [transactions.buyerId],
    references: [businesses.id],
  }),
}));

export const transactionsSeller = relations(transactions, ({ one }) => ({
  buyer: one(businesses, {
    fields: [transactions.buyerId],
    references: [businesses.id],
  }),
}));

export const businesssTransactions = relations(businesses, ({ many }) => ({
  transactions: many(transactions),
}));
