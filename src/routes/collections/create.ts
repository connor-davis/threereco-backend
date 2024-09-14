import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import db from "../../db";
import { createCollectionSchema } from "../../models/collection";
import { collections, transactions } from "../../schemas";
import authMiddleware from "../../utilities/authMiddleware";

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
    await db.insert(transactions).values({
      buyerId: collection.businessId,
      sellerId: collection.businessId,
      productId: collection.productId,
      weight: collection.weight,
    });

    return context.json({ ...collection }, 200);
  }
);

export default createCollectionRouter;
