import { Hono } from "hono";
import { z } from "zod";
import authMiddleware from "../../utilities/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import db from "../../db";
import { products } from "../../schemas";
import { eq } from "drizzle-orm";

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
        .where(eq(products.id, id));

      return context.json({ ...productResult }, 200);
    }
  }
);

export default viewProductsRouter;
