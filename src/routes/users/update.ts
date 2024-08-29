import { Hono } from "hono";
import { z } from "zod";
import authMiddleware from "../../utilities/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import db from "../../db";
import { users } from "../../schemas";
import { eq } from "drizzle-orm";
import { updateUserSchema } from "../../models/user";

const updateUserRouter = new Hono();

const querySchema = z.object({
  id: z.string().uuid(),
});

updateUserRouter.delete(
  "/",
  async (context, next) =>
    await authMiddleware(["System Admin", "Admin", "Staff"], context, next),
  zValidator("query", querySchema),
  zValidator("json", updateUserSchema),
  async (context) => {
    const { id } = await querySchema.parseAsync(context.req.query());
    const updateUser = await updateUserSchema.parseAsync(
      await context.req.json()
    );

    await db.update(users).set(updateUser).where(eq(users.id, id));

    return context.text("ok", 200);
  }
);

export default updateUserRouter;
