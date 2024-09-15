import { relations, sql } from "drizzle-orm";
import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import { decimalNumber } from "../utilities/postgres";
import { businesses } from "./businesses";

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

export const transactionsBuyer = relations(transactions, ({ one }) => ({
  buyer: one(businesses, {
    fields: [transactions.buyerId],
    references: [businesses.id],
  }),
}));

export const transactionsSeller = relations(transactions, ({ one }) => ({
  seller: one(businesses, {
    fields: [transactions.buyerId],
    references: [businesses.id],
  }),
}));

export const businesssTransactions = relations(businesses, ({ many }) => ({
  transactions: many(transactions),
}));
