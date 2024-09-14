import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import db from "../../db";
import { collections } from "../../schemas";
import authMiddleware from "../../utilities/authMiddleware";

const deleteCollectionRouter = new Hono();

const QuerySchema = z.object({
  id: z.string().uuid(),
});

deleteCollectionRouter.delete(
  "/",
  async (context, next) =>
    await authMiddleware(
      ["System Admin", "Admin"],
      context,
      next
    ),
  zValidator("query", QuerySchema),
  async (context) => {
    const { id } = await QuerySchema.parseAsync(context.req.query());

    await db.delete(collections).where(eq(collections.id, id));

    return context.text("ok", 200);
  }
);

export default deleteCollectionRouter;
