import { Hono } from "hono";
import { z } from "zod";
import authMiddleware from "../../utilities/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import db from "../../db";
import { products } from "../../schemas";
import { eq } from "drizzle-orm";
import { productSchema } from "../../models/product";

const viewProductsRouter = new Hono();

const QuerySchema = z.object({
  id: z.string().uuid().nullable().optional(),
});

viewProductsRouter.get(
  "/",
  async (context, next) =>
    await authMiddleware(
      ["System Admin", "Admin", "Staff", "Business"],
      context,
      next
    ),
  zValidator("query", QuerySchema),
  async (context) => {
    const { id } = await QuerySchema.parseAsync(context.req.query());

    if (!id) {
      const productsResult = await db.select().from(products);

      return context.json([...productsResult], 200);
    } else {
      const productResult = await db
        .select()
        .from(products)
        .where(eq(products.id, id))
        .limit(1);
      const productFound = productResult[0];

      if (!productFound) {
        return context.json(
          { error: "Not Found", reason: "Product not found." },
          404
        );
      }

      return context.json(
        {
          ...productSchema.parse({ ...productFound, business: null }),
        },
        200
      );
    }
  }
);

export default viewProductsRouter;
