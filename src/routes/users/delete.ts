import { Hono } from "hono";
import { z } from "zod";
import authMiddleware from "../../utilities/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import db from "../../db";
import { users } from "../../schemas";
import { eq } from "drizzle-orm";

const deleteUserRouter = new Hono();

const querySchema = z.object({
  id: z.string().uuid(),
});

deleteUserRouter.delete(
  "/",
  async (context, next) =>
    await authMiddleware(["System Admin", "Admin"], context, next),
  zValidator("query", querySchema),
  async (context) => {
    const { id } = await querySchema.parseAsync(context.req.query());

    await db.delete(users).where(eq(users.id, id));

    return context.text("ok", 200);
  }
);

export default deleteUserRouter;
