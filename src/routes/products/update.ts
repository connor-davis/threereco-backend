import { Hono } from "hono";
import { z } from "zod";
import authMiddleware from "../../utilities/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import db from "../../db";
import { products } from "../../schemas";
import { and, eq } from "drizzle-orm";
import { updateProductSchema } from "../../models/product";

const updateProductRouter = new Hono();

const QuerySchema = z.object({
  id: z.string().uuid(),
});

updateProductRouter.put(
  "/",
  async (context, next) =>
    await authMiddleware(
      ["System Admin", "Admin", "Staff", "Business"],
      context,
      next
    ),
  zValidator("query", QuerySchema),
  zValidator("json", updateProductSchema),
  async (context) => {
    const { id } = await QuerySchema.parseAsync(context.req.query());
    const product = await updateProductSchema.parseAsync(
      await context.req.json()
    );

    if (product.name) {
      const result = await db
        .select()
        .from(products)
        .where(
          and(
            eq(products.name, product.name),
            eq(products.businessId, product.businessId)
          )
        )
        .limit(1);
      const productFound = result[0];

      if (productFound) {
        return context.json(
          {
            error: "Bad Request",
            reason: "Product already exists with that name for the business.",
          },
          400
        );
      }
    }

    await db.update(products).set(product).where(eq(products.id, id));

    return context.json({ ...product }, 200);
  }
);

export default updateProductRouter;
