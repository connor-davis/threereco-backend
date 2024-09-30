import { businessSchema } from "./business";
import { collectorSchema } from "./collector";
import { productSchema } from "./product";
import { z } from "zod";

export const collectionSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  business: z.object({
    ...businessSchema.shape,
  }),
  collectorId: z.string().uuid(),
  collector: z.object({
    ...collectorSchema.shape,
  }),
  productId: z.string().uuid(),
  product: z.object({
    ...productSchema.shape,
  }),
  weight: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Collection = z.infer<typeof collectionSchema>;

export const createCollectionSchema = z.object({
  businessId: z.string().uuid(),
  collectorId: z.string().uuid(),
  productId: z.string().uuid(),
  weight: z.number(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type CreateCollection = z.infer<typeof createCollectionSchema>;

export const updateCollectionSchema = z.object({
  businessId: z.string().uuid().optional(),
  collectorId: z.string().uuid().optional(),
  productId: z.string().uuid().optional(),
  weight: z.number().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type UpdateCollection = z.infer<typeof updateCollectionSchema>;
