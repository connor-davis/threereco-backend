import { Hono } from "hono";
import authMiddleware from "../../utilities/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import { createBusinessSchema } from "../../models/business";
import db from "../../db";
import { businesses, users } from "../../schemas";
import { eq } from "drizzle-orm";

const createBusinessRouter = new Hono();

createBusinessRouter.post(
  "/",
  async (context, next) =>
    await authMiddleware(["System Admin", "Admin", "Staff"], context, next),
  zValidator("json", createBusinessSchema),
  async (context) => {
    const business = await createBusinessSchema.parseAsync(
      await context.req.json()
    );

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
          reason: "Business already exists with that business name.",
        },
        400
      );
    }

    await db.insert(businesses).values(business);

    return context.json({ ...business }, 200);
  }
);

export default createBusinessRouter;
