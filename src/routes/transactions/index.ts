import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import db from "../../db";
import authMiddleware from "../../utilities/authMiddleware";

const transactionsRouter = new Hono();

const QuerySchema = z.object({
  id: z.string().uuid().nullable().optional(),
});

transactionsRouter.get(
  "/",
  async (context, next) =>
    await authMiddleware(
      ["System Admin", "Admin", "Staff", "Business", "Collector"],
      context,
      next
    ),
  zValidator("query", QuerySchema),
  async (context) => {
    // const { id } = await QuerySchema.parseAsync(context.req.query());

    const results = await db.query.transactions.findMany({
      with: {
        buyer: true,
        seller: true,
      },
    });

    return context.json([...results], 200);
  }
);

export default transactionsRouter;
