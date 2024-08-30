import { Hono } from "hono";
import { z } from "zod";
import authMiddleware from "../../utilities/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import db from "../../db";
import { collectors } from "../../schemas";
import { eq } from "drizzle-orm";
import { updateCollectorSchema } from "../../models/collector";

const updateCollectorRouter = new Hono();

const QuerySchema = z.object({
  id: z.string().uuid(),
});

updateCollectorRouter.put(
  "/",
  async (context, next) =>
    await authMiddleware(
      ["System Admin", "Admin", "Staff", "Business"],
      context,
      next
    ),
  zValidator("query", QuerySchema),
  zValidator("json", updateCollectorSchema),
  async (context) => {
    const { id } = await QuerySchema.parseAsync(context.req.query());
    const collector = await updateCollectorSchema.parseAsync(
      await context.req.json()
    );

    if (collector.idNumber) {
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
    }

    await db.update(collectors).set(collector).where(eq(collectors.id, id));

    return context.json({ ...collector }, 200);
  }
);

export default updateCollectorRouter;
