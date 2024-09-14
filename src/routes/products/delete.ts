import { Hono } from "hono";
import { z } from "zod";
import authMiddleware from "../../utilities/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import db from "../../db";
import { products } from "../../schemas";
import { eq } from "drizzle-orm";

const deleteProductRouter = new Hono();

const QuerySchema = z.object({
  id: z.string().uuid(),
});

deleteProductRouter.delete(
  "/",
  async (context, next) =>
    await authMiddleware(
      ["System Admin", "Admin"],
      context,
      next
    ),
  zValidator("query", QuerySchema),
  async (context) => {
    const { id } = await QuerySchema.parseAsync(context.req.query());

    await db.delete(products).where(eq(products.id, id));

    return context.text("ok", 200);
  }
);

export default deleteProductRouter;
