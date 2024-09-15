import { businessSchema } from "./business";
import { z } from "zod";

export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  price: z.number(),
  gwCode: z.string(),
  carbonFactor: z.string(),
  businessId: z.string().uuid(),
  business: z
    .object({
      ...businessSchema.shape,
    })
    .nullable()
    .optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Collector = z.infer<typeof productSchema>;

export const createProductSchema = z.object({
  name: z.string(),
  price: z.number(),
  gwCode: z.string(),
  carbonFactor: z.string(),
  businessId: z.string().uuid(),
});

export type CreateCollector = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
  name: z.string().optional(),
  price: z.number().optional(),
  gwCode: z.string().optional(),
  carbonFactor: z.string().optional(),
  businessId: z.string().uuid(),
});

export type UpdateCollector = z.infer<typeof updateProductSchema>;
