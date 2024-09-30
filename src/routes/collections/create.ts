import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { Session } from "hono-sessions";
import db from "../../db";
import { createCollectionSchema } from "../../models/collection";
import { businesses, collections } from "../../schemas";
import authMiddleware from "../../utilities/authMiddleware";

const createCollectionRouter = new Hono<{
  Variables: {
    session: Session;
    session_key_rotation: boolean;
  };
}>();

createCollectionRouter.post(
  "/",
  async (context, next) =>
    await authMiddleware(
      ["System Admin", "Admin", "Staff", "Business"],
      context,
      next
    ),
  zValidator("json", createCollectionSchema),
  async (context) => {
    const collection = await createCollectionSchema.parseAsync(
      await context.req.json()
    );

    const session = context.get("session");
    const userId = session.get("user_id") as string;

    let { businessId } =
      collection ||
      (
        await db
          .select({ businessId: businesses.id })
          .from(businesses)
          .where(eq(businesses.userId, userId))
          .limit(1)
      )[0];

    await db.insert(collections).values({
      ...collection,
      businessId: businessId!!,
    });

    return context.json({ ...collection }, 200);
  }
);

export default createCollectionRouter;
