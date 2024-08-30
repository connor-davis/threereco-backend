import { Hono } from "hono";
import { z } from "zod";
import authMiddleware from "../../utilities/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import db from "../../db";
import { businesses } from "../../schemas";
import { eq } from "drizzle-orm";

const deleteBusinessRouter = new Hono();

const QuerySchema = z.object({
  id: z.string().uuid(),
});

deleteBusinessRouter.delete(
  "/",
  async (context, next) =>
    await authMiddleware(["System Admin", "Admin", "Staff"], context, next),
  zValidator("query", QuerySchema),
  async (context) => {
    const { id } = await QuerySchema.parseAsync(context.req.query());

    await db.delete(businesses).where(eq(businesses.id, id));

    return context.text("ok", 200);
  }
);

export default deleteBusinessRouter;
