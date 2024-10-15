import { relations, sql } from "drizzle-orm";
import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import { decimalNumber } from "@/lib/types";

import businesses from "./business";

export const transactions = pgTable("transactions", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  buyerId: uuid("buyer_id").notNull(),
  sellerId: uuid("seller_id").notNull(),
  productId: uuid("product_id").notNull(),
  weight: decimalNumber("weight").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, precision: 6 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, precision: 6 })
    .defaultNow()
    .notNull(),
});

export const transactionBuyer = relations(transactions, ({ one }) => ({
  buyer: one(businesses, {
    fields: [transactions.buyerId],
    references: [businesses.id],
  }),
}));

export const transactionSeller = relations(transactions, ({ one }) => ({
  seller: one(businesses, {
    fields: [transactions.buyerId],
    references: [businesses.id],
  }),
}));

export const businessTransactions = relations(businesses, ({ many }) => ({
  transactions: many(transactions),
}));
