import { Hono } from "hono";
import authMiddleware from "../../utilities/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import db from "../../db";
import { products } from "../../schemas";
import { and, eq } from "drizzle-orm";
import { createProductSchema } from "../../models/product";

const createProductRouter = new Hono();

createProductRouter.post(
  "/",
  async (context, next) =>
    await authMiddleware(
      ["System Admin", "Admin", "Staff", "Business"],
      context,
      next
    ),
  zValidator("json", createProductSchema),
  async (context) => {
    const product = await createProductSchema.parseAsync(
      await context.req.json()
    );

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
          reason: "Product with that name already exists for the business.",
        },
        400
      );
    }

    await db.insert(products).values(product);

    return context.json({ ...product }, 200);
  }
);

export default createProductRouter;
