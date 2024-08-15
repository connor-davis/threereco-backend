import { genSalt, hash } from "bcrypt";

import { Hono } from "hono";
import authMiddleware from "../../utilities/authMiddleware";
import { createUserSchema } from "../../models/user";
import db from "../../db";
import { eq } from "drizzle-orm";
import { users } from "../../schemas";
import { zValidator } from "@hono/zod-validator";

const createUserRouter = new Hono();

createUserRouter.post(
  "/",
  async (context, next) =>
    await authMiddleware(["System Admin", "Admin", "Staff"], context, next),
  zValidator("json", createUserSchema),
  async (context) => {
    const { email, password, role } = await createUserSchema.parseAsync(
      await context.req.json()
    );

    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    const userFound = userResult[0];

    if (userFound) {
      return context.json(
        {
          error: "Conflict",
          reason: "A user with that email already exists.",
        },
        409
      );
    }

    const passwordSalt = await genSalt(2048);
    const hashedPassword = await hash(password, passwordSalt);

    await db
      .insert(users)
      .values({ email, password: hashedPassword, role })
      .returning();

    return context.json({
      success: true,
    });
  }
);

export default createUserRouter;
