import { Hono } from "hono";
import { z } from "zod";
import authMiddleware from "../../utilities/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import { updateBusinessSchema } from "../../models/business";
import db from "../../db";
import { businesses } from "../../schemas";
import { eq } from "drizzle-orm";

const updateBusinessRouter = new Hono();

const QuerySchema = z.object({
  id: z.string().uuid(),
});

updateBusinessRouter.put(
  "/",
  async (context, next) =>
    await authMiddleware(["System Admin", "Admin", "Staff"], context, next),
  zValidator("query", QuerySchema),
  zValidator("json", updateBusinessSchema),
  async (context) => {
    const { id } = await QuerySchema.parseAsync(context.req.query());
    const business = await updateBusinessSchema.parseAsync(
      await context.req.json()
    );

    if (business.name) {
      const result = await db
        .select()
        .from(businesses)
        .where(eq(businesses.name, business.name))
        .limit(1);
      const businessFound = result[0];

      if (businessFound) {
        return context.json(
          {
            error: "Bad Request",
            reason: "Business already exists with that name.",
          },
          400
        );
      }
    }

    await db
      .update(businesses)
      .set({ ...business, updatedAt: new Date() })
      .where(eq(businesses.id, id));

    return context.json({ ...business }, 200);
  }
);

export default updateBusinessRouter;
