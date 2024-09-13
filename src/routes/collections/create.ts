import { Hono } from "hono";
import authMiddleware from "../../utilities/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import db from "../../db";
import { collections, collectors } from "../../schemas";
import { eq } from "drizzle-orm";
import { createCollectorSchema } from "../../models/collector";
import { createCollectionSchema } from "../../models/collection";

const createCollectionRouter = new Hono();

createCollectionRouter.post(
  "/",
  async (context, next) =>
    await authMiddleware(
      ["System Admin", "Admin", "Staff", "Business"],
      context,
      next
    ),
  zValidator("json", createCollectionSchema),
  async (context) => {
    const collection = await createCollectionSchema.parseAsync(
      await context.req.json()
    );

    await db.insert(collections).values(collection);

    return context.json({ ...collection }, 200);
  }
);

export default createCollectionRouter;
