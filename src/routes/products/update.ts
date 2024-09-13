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

    await db.update(products).set(product).where(eq(products.id, id));

    return context.json({ ...product }, 200);
  }
);

export default updateProductRouter;
