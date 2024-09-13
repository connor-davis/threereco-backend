import { Hono } from "hono";
import { z } from "zod";
import authMiddleware from "../../utilities/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import db from "../../db";
import { collectors, users } from "../../schemas";
import { eq, like, or } from "drizzle-orm";
import { collectorSchema } from "../../models/collector";
import { validate as isValidUuid } from "uuid";

const searchCollectorsRouter = new Hono();

const QuerySchema = z.object({
  query: z.string(),
});

searchCollectorsRouter.get(
  "/",
  async (context, next) =>
    await authMiddleware(
      ["System Admin", "Admin", "Staff", "Business"],
      context,
      next
    ),
  zValidator("query", QuerySchema),
  async (context) => {
    const { query } = await QuerySchema.parseAsync(context.req.query());

    const results = await db
      .select()
      .from(collectors)
      .leftJoin(users, eq(collectors.userId, users.id))
      .where(
        or(
          like(users.email, `%${query}%`),
          like(collectors.firstName, `%${query}%`),
          like(collectors.lastName, `%${query}%`),
          like(collectors.idNumber, `%${query}%`),
          like(collectors.phoneNumber, `%${query}%`),
          isValidUuid(query) ? eq(collectors.id, query) : undefined,
          isValidUuid(query) ? eq(collectors.userId, query) : undefined
        )
      );

    return context.json(
      [
        ...results.map((result) =>
          collectorSchema.parse({
            ...result.collectors,
            user: result.users,
          })
        ),
      ],
      200
    );
  }
);

export default searchCollectorsRouter;
