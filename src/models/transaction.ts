import { collectionSchema } from "./collection";
import { z } from "zod";

export const transactionSchema = z.object({
  id: z.string().uuid(),
  collectionId: z.string().uuid(),
  collection: z.object({
    ...collectionSchema.shape,
  }),
  weight: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Transaction = z.infer<typeof transactionSchema>;

export const createTransactionSchema = z.object({
  collectionId: z.string().uuid(),
  weight: z.number(),
});

export type CreateTransaction = z.infer<typeof createTransactionSchema>;

export const updateTransactionSchema = z.object({
  collectionId: z.string().uuid().optional(),
  weight: z.number().optional(),
});

export type UpdateTransaction = z.infer<typeof updateTransactionSchema>;
