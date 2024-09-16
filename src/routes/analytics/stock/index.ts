import { Hono } from "hono";
import authMiddleware from "../../../utilities/authMiddleware";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import db from "../../../db";
import { collections, products } from "../../../schemas";
import { and, asc, eq, gte, lte, sum } from "drizzle-orm";

const stockRouter = new Hono();

const QuerySchema = z.object({
  month: z.coerce.number(),
  year: z.coerce.number(),
});

stockRouter.get(
  "/dated-collection-weights",
  async (context, next) =>
    await authMiddleware(
      ["System Admin", "Admin", "Staff", "Business"],
      context,
      next
    ),
  zValidator("query", QuerySchema),
  async (context) => {
    const { month, year } = await QuerySchema.parseAsync(context.req.query());

    // Create date range for the specified month
    const startDate = new Date(year, month, 1); // Start of the month
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999); // End of the month

    const results = await db
      .select({
        productName: products.name,
        totalWeight: sum(collections.weight),
        collectionDate: collections.createdAt,
      })
      .from(collections)
      .leftJoin(products, eq(collections.productId, products.id))
      .where(
        and(
          gte(collections.createdAt, startDate),
          lte(collections.createdAt, endDate)
        )
      )
      .groupBy(products.name, collections.createdAt)
      .orderBy(asc(collections.createdAt));

    return context.json([...results], 200);
  }
);

export default stockRouter;
