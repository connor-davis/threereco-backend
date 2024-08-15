import { businessTypes } from "../schemas";
import { userSchema } from "./user";
import { z } from "zod";

export const businessSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: z.enum(businessTypes.enumValues),
  description: z.string(),
  phoneNumber: z.string(),
  address: z.string(),
  city: z.string(),
  province: z.string(),
  zipCode: z.string(),
  userId: z.string().uuid(),
  user: z.object({
    ...userSchema.shape,
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Business = z.infer<typeof businessSchema>;

export const createBusinessSchema = z.object({
  name: z.string(),
  type: z.enum(businessTypes.enumValues),
  description: z.string(),
  phoneNumber: z.string(),
  address: z.string(),
  city: z.string(),
  province: z.string(),
  zipCode: z.string(),
  userId: z.string().uuid(),
});

export type CreateBusiness = z.infer<typeof createBusinessSchema>;

export const updateBusinessSchema = z.object({
  name: z.string().optional(),
  type: z.enum(businessTypes.enumValues).optional(),
  description: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  zipCode: z.string().optional(),
});

export type UpdateBusiness = z.infer<typeof updateBusinessSchema>;
