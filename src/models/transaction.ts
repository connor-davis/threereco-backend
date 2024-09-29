import { businessSchema } from "./business";
import { collectionSchema } from "./collection";
import { z } from "zod";
import { productSchema } from "./product";

export const transactionSchema = z.object({
  id: z.string().uuid(),
  buyerId: z.string().uuid(),
  sellerId: z.string().uuid(),
  productId: z.string().uuid(),
  buyer: z.object(businessSchema.shape).nullable().optional(),
  seller: z.object(businessSchema.shape).nullable().optional(),
  product: z.object(productSchema.shape).nullable().optional(),
  weight: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Transaction = z.infer<typeof transactionSchema>;

export const createTransactionSchema = z.object({
  buyerId: z.string().uuid(),
  sellerId: z.string().uuid(),
  productId: z.string().uuid(),
  weight: z.number(),
});

export type CreateTransaction = z.infer<typeof createTransactionSchema>;

export const updateTransactionSchema = z.object({
  buyerId: z.string().uuid().optional(),
  sellerId: z.string().uuid().optional(),
  productId: z.string().uuid().optional(),
  weight: z.number().optional(),
});

export type UpdateTransaction = z.infer<typeof updateTransactionSchema>;
