import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import db from "../../db";
import { updateCollectionSchema } from "../../models/collection";
import { collections } from "../../schemas";
import authMiddleware from "../../utilities/authMiddleware";

const updateCollectionRouter = new Hono();

const QuerySchema = z.object({
  id: z.string().uuid(),
});

updateCollectionRouter.put(
  "/",
  async (context, next) =>
    await authMiddleware(
      ["System Admin", "Admin", "Staff", "Business"],
      context,
      next
    ),
  zValidator("query", QuerySchema),
  zValidator("json", updateCollectionSchema),
  async (context) => {
    const { id } = await QuerySchema.parseAsync(context.req.query());
    const collection = await updateCollectionSchema.parseAsync(
      await context.req.json()
    );

    await db.update(collections).set(collection).where(eq(collections.id, id));

    return context.json({ ...collection }, 200);
  }
);

export default updateCollectionRouter;
