import { businessSchema } from "./business";
import { z } from "zod";

export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  businessId: z.string().uuid(),
  business: z.object({
    ...businessSchema.shape,
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Collector = z.infer<typeof productSchema>;

export const createProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  businessId: z.string().uuid(),
});

export type CreateCollector = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
});

export type UpdateCollector = z.infer<typeof updateProductSchema>;
