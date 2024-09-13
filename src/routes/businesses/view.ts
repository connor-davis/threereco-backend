import { Hono } from "hono";
import { z } from "zod";
import authMiddleware from "../../utilities/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import db from "../../db";
import { businesses, users } from "../../schemas";
import { eq } from "drizzle-orm";
import { businessSchema } from "../../models/business";

const viewBusinessesRouter = new Hono();

const QuerySchema = z.object({
  id: z.string().uuid().nullable().optional(),
  includeUser: z.coerce.boolean().nullable().optional(),
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
    const { id, includeUser } = await QuerySchema.parseAsync(
      context.req.query()
    );

    if (!id) {
      const businessesResult = await db.select().from(businesses);

      return context.json([...businessesResult], 200);
    } else {
      if (includeUser) {
        const businessResult = await db
          .select()
          .from(businesses)
          .where(eq(businesses.id, id))
          .limit(1)
          .innerJoin(users, eq(users.id, businesses.userId));
        const businessFound = businessResult[0];

        if (!businessFound) {
          return context.json(
            { error: "Not Found", reason: "Business not found." },
            404
          );
        }

        return context.json(
          {
            ...businessSchema.parse({
              ...businessFound.businesses,
              user: businessFound.users,
            }),
          },
          200
        );
      } else {
        const businessResult = await db
          .select()
          .from(businesses)
          .where(eq(businesses.id, id))
          .limit(1);
        const businessFound = businessResult[0];

        if (!businessFound) {
          return context.json(
            { error: "Not Found", reason: "Business not found." },
            404
          );
        }

        return context.json(
          {
            ...businessSchema.parse({ ...businessFound, user: null }),
          },
          200
        );
      }
    }
  }
);

export default viewBusinessesRouter;
