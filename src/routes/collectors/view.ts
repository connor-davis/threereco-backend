import { Hono } from "hono";
import { z } from "zod";
import authMiddleware from "../../utilities/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import db from "../../db";
import { collectors } from "../../schemas";
import { eq } from "drizzle-orm";

const viewCollectorsRouter = new Hono();

const QuerySchema = z.object({
  id: z.string().uuid().nullable().optional(),
});

viewCollectorsRouter.get(
  "/",
  async (context, next) =>
    await authMiddleware(
      ["System Admin", "Admin", "Staff", "Business", "Collector"],
      context,
      next
    ),
  zValidator("query", QuerySchema),
  async (context) => {
    const { id } = await QuerySchema.parseAsync(context.req.query());

    if (!id) {
      const collectorsResult = await db.select().from(collectors);

      return context.json([...collectorsResult], 200);
    } else {
      const collectorResult = await db
        .select()
        .from(collectors)
        .where(eq(collectors.id, id));

      return context.json({ ...collectorResult }, 200);
    }
  }
);

export default viewCollectorsRouter;
