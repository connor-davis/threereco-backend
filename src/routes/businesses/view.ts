import { Hono } from "hono";
import { z } from "zod";
import authMiddleware from "../../utilities/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import db from "../../db";
import { businesses } from "../../schemas";
import { eq } from "drizzle-orm";

const viewBusinessesRouter = new Hono();

const QuerySchema = z.object({
  id: z.string().uuid().nullable().optional(),
});

viewBusinessesRouter.get(
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
      const businessesResult = await db.select().from(businesses);

      return context.json([...businessesResult], 200);
    } else {
      const businessResult = await db
        .select()
        .from(businesses)
        .where(eq(businesses.id, id));

      return context.json({ ...businessResult }, 200);
    }
  }
);

export default viewBusinessesRouter;
