import { userSchema } from "./user";
import { z } from "zod";

export const collectorSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  idNumber: z.string(),
  phoneNumber: z.string(),
  address: z.string(),
  city: z.string(),
  province: z.string(),
  zipCode: z.string(),
  bankName: z.string(),
  bankAccountHolder: z.string(),
  bankAccountNumber: z.string(),
  userId: z.string().uuid(),
  user: z
    .object({
      ...userSchema.shape,
    })
    .nullable()
    .optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Collector = z.infer<typeof collectorSchema>;

export const createCollectorSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  idNumber: z.string(),
  phoneNumber: z.string(),
  address: z.string(),
  city: z.string(),
  province: z.string(),
  zipCode: z.string(),
  bankName: z.string(),
  bankAccountHolder: z.string(),
  bankAccountNumber: z.string(),
  userId: z.string().uuid(),
});

export type CreateCollector = z.infer<typeof createCollectorSchema>;

export const updateCollectorSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  idNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  zipCode: z.string().optional(),
});

export type UpdateCollector = z.infer<typeof updateCollectorSchema>;
