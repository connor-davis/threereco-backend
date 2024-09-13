import { Hono } from "hono";
import { z } from "zod";
import authMiddleware from "../../utilities/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import db from "../../db";
import { collectors, users } from "../../schemas";
import { eq } from "drizzle-orm";
import { collectorSchema } from "../../models/collector";

const viewCollectorsRouter = new Hono();

const QuerySchema = z.object({
  id: z.string().uuid().nullable().optional(),
  includeUser: z.boolean().nullable().optional(),
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
    const { id, includeUser } = await QuerySchema.parseAsync(
      context.req.query()
    );

    if (!id) {
      const collectorsResult = await db.select().from(collectors);

      return context.json([...collectorsResult], 200);
    } else {
      if (includeUser) {
        const collectorResult = await db
          .select()
          .from(collectors)
          .where(eq(collectors.id, id))
          .limit(1)
          .innerJoin(users, eq(users.id, collectors.userId));
        const collectorFound = collectorResult[0];

        console.log(collectorFound);

        if (!collectorFound) {
          return context.json(
            { error: "Not Found", reason: "Collector not found." },
            404
          );
        }

        return context.json(
          {
            ...collectorSchema.parse(collectorFound),
          },
          200
        );
      } else {
        const collectorResult = await db
          .select()
          .from(collectors)
          .where(eq(collectors.id, id))
          .limit(1);
        const collectorFound = collectorResult[0];

        if (!collectorFound) {
          return context.json(
            { error: "Not Found", reason: "Collector not found." },
            404
          );
        }

        return context.json(
          {
            ...collectorSchema.parse({ ...collectorFound, user: null }),
          },
          200
        );
      }
    }
  }
);

export default viewCollectorsRouter;
