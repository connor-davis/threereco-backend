import { roles } from "../schemas";
import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(roles.enumValues),
  active: z.boolean(),
  mfaEnabled: z.boolean(),
  mfaVerified: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof userSchema>;

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  role: z.enum(roles.enumValues),
});

export type CreateUser = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  role: z.enum(roles.enumValues).optional(),
  active: z.boolean().optional(),
  mfaEnabled: z.boolean().optional(),
  mfaVerified: z.boolean().optional(),
  mfaSecret: z.string().optional(),
});

export type UpdateUser = z.infer<typeof updateUserSchema>;
