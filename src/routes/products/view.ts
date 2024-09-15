import { Hono } from "hono";
import { z } from "zod";
import authMiddleware from "../../utilities/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import db from "../../db";
import { businesses, products } from "../../schemas";
import { and, eq, or } from "drizzle-orm";
import { productSchema } from "../../models/product";
import { Session } from "hono-sessions";

const viewProductsRouter = new Hono<{
  Variables: {
    session: Session;
    session_key_rotation: boolean;
  };
}>();

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
    const session = context.get("session");
    const userId = session.get("user_id") as string;
    const userRole = session.get("user_role") as string;
    const isBusinessUser = userRole === "Business";

    if (isBusinessUser) {
      const businessResults = await db
        .select()
        .from(businesses)
        .where(eq(businesses.userId, userId))
        .limit(1);
      const business = businessResults[0];
      const businessId = business.id;

      if (!id) {
        const productsResult = await db
          .select()
          .from(products)
          .where(eq(products.businessId, businessId));

        return context.json([...productsResult], 200);
      } else {
        const productResult = await db
          .select()
          .from(products)
          .where(and(eq(products.id, id), eq(products.businessId, businessId)))
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
    } else {
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
  }
);

export default viewProductsRouter;
