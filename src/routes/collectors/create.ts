import { Hono } from "hono";
import authMiddleware from "../../utilities/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import db from "../../db";
import { collectors } from "../../schemas";
import { eq } from "drizzle-orm";
import { createCollectorSchema } from "../../models/collector";

const createCollectorRouter = new Hono();

createCollectorRouter.post(
  "/",
  async (context, next) =>
    await authMiddleware(
      ["System Admin", "Admin", "Staff", "Business"],
      context,
      next
    ),
  zValidator("json", createCollectorSchema),
  async (context) => {
    const collector = await createCollectorSchema.parseAsync(
      await context.req.json()
    );

    const result = await db
      .select()
      .from(collectors)
      .where(eq(collectors.idNumber, collector.idNumber))
      .limit(1);
    const collectorFound = result[0];

    if (collectorFound) {
      return context.json(
        {
          error: "Bad Request",
          reason: "Collector already exists with that ID number.",
        },
        400
      );
    }

    await db.insert(collectors).values(collector);

    return context.json({ ...collector }, 200);
  }
);

export default createCollectorRouter;
