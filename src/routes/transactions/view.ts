import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { Hono } from "hono";
import { z } from "zod";
import db from "../../db";
import { transactionSchema } from "../../models/transaction";
import { businesses, products, transactions } from "../../schemas";
import authMiddleware from "../../utilities/authMiddleware";

const viewTransactionsRouter = new Hono();

const QuerySchema = z.object({
  id: z.string().uuid().nullable().optional(),
  includeBuyer: z.coerce.boolean().nullable().optional(),
  includeSeller: z.coerce.boolean().nullable().optional(),
  includeProduct: z.coerce.boolean().nullable().optional(),
});

viewTransactionsRouter.get(
  "/",
  async (context, next) =>
    await authMiddleware(
      ["System Admin", "Admin", "Staff", "Business", "Collector"],
      context,
      next
    ),
  zValidator("query", QuerySchema),
  async (context) => {
    const { id, includeBuyer, includeSeller, includeProduct } =
      await QuerySchema.parseAsync(context.req.query());

    const seller = alias(businesses, "seller");
    const buyer = alias(businesses, "buyer");

    const results = await db
      .select()
      .from(transactions)
      .leftJoin(seller, eq(seller.id, transactions.sellerId))
      .leftJoin(buyer, eq(buyer.id, transactions.buyerId))
      .leftJoin(products, eq(products.id, transactions.productId))
      .where(id ? eq(transactions.id, id) : undefined);

    if (id) {
      return context.json(
        {
          ...transactionSchema.parse({
            ...results[0].transactions,
            buyer: includeBuyer ? results[0].buyer : null,
            seller: includeSeller ? results[0].seller : null,
            product: includeProduct ? results[0].products : null,
          }),
        },
        200
      );
    } else {
      return context.json(
        [
          ...results.map((result) =>
            transactionSchema.parse({
              ...result.transactions,
              buyer: includeBuyer ? result.buyer : null,
              seller: includeSeller ? result.seller : null,
              product: includeProduct ? result.products : null,
            })
          ),
        ],
        200
      );
    }
  }
);

export default viewTransactionsRouter;
