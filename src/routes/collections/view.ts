import { zValidator } from "@hono/zod-validator";
import { eq, or } from "drizzle-orm";
import { QueryBuilder } from "drizzle-orm/pg-core";
import { Hono } from "hono";
import { z } from "zod";
import db from "../../db";
import { businesses, collections, collectors, products } from "../../schemas";
import authMiddleware from "../../utilities/authMiddleware";

const viewCollectionsRouter = new Hono();

const QuerySchema = z.object({
  id: z.string().uuid().nullable().optional(),
  includeBusiness: z.coerce.boolean().nullable().optional(),
  includeCollector: z.coerce.boolean().nullable().optional(),
  includeProduct: z.coerce.boolean().nullable().optional(),
});

viewCollectionsRouter.get(
  "/",
  async (context, next) =>
    await authMiddleware(
      ["System Admin", "Admin", "Staff", "Business", "Collector"],
      context,
      next
    ),
  zValidator("query", QuerySchema),
  async (context) => {
    const { id, includeBusiness, includeCollector, includeProduct } =
      await QuerySchema.parseAsync(context.req.query());

    const results = await db
      .select()
      .from(collections)
      .leftJoin(businesses, eq(collections.businessId, businesses.id))
      .leftJoin(collectors, eq(collections.collectorId, collectors.id))
      .leftJoin(products, eq(collections.productId, products.id))
      .where(or(id ? eq(collections.id, id) : undefined));

    if (id)
      return context.json(
        {
          ...results[0].collections,
          business: includeBusiness ? results[0].businesses : null,
          collector: includeCollector ? results[0].collectors : null,
          product: includeProduct ? results[0].products : null,
        },
        200
      );
    else
      return context.json(
        [
          ...results.map((result) => ({
            ...result.collections,
            business: includeBusiness ? result.businesses : null,
            collector: includeCollector ? result.collectors : null,
            product: includeProduct ? result.products : null,
          })),
        ],
        200
      );
  }
);

export default viewCollectionsRouter;
