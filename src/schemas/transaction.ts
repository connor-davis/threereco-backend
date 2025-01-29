import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import { decimalNumber } from "@/lib/types";

import { businesses } from "./business";
import { collectors } from "./collector";
import { products } from "./products";

export const transactions = pgTable("transactions", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  buyerId: uuid()
    .notNull()
    .references(() => businesses.id, { onDelete: "cascade" })
    .references(() => collectors.id, { onDelete: "cascade" }),
  sellerId: uuid()
    .notNull()
    .references(() => businesses.id, { onDelete: "cascade" })
    .references(() => collectors.id, { onDelete: "cascade" }),
  productId: uuid()
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  weight: decimalNumber().notNull(),
  createdAt: timestamp({ withTimezone: true, precision: 6 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ withTimezone: true, precision: 6 })
    .defaultNow()
    .notNull(),
});

export const transactionBusinessBuyer = relations(transactions, ({ one }) => ({
  buyer: one(businesses, {
    fields: [transactions.buyerId],
    references: [businesses.id],
  }),
}));

export const transactionCollectorBuyer = relations(transactions, ({ one }) => ({
  buyer: one(collectors, {
    fields: [transactions.buyerId],
    references: [collectors.id],
  }),
}));

export const transactionBusinessSeller = relations(transactions, ({ one }) => ({
  seller: one(businesses, {
    fields: [transactions.buyerId],
    references: [businesses.id],
  }),
}));

export const transactionCollectorSeller = relations(
  transactions,
  ({ one }) => ({
    seller: one(collectors, {
      fields: [transactions.buyerId],
      references: [collectors.id],
    }),
  })
);

export const businessTransactions = relations(businesses, ({ many }) => ({
  transactions: many(transactions),
}));

export const collectorTransactions = relations(collectors, ({ many }) => ({
  transactions: many(transactions),
}));
