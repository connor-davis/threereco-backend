import { Hono } from "hono";
import type { Session } from "hono-sessions";
import authMiddleware from "../../utilities/authMiddleware";
import db from "../../db";
import { eq } from "drizzle-orm";
import { userSchema } from "../../models/user";
import { users } from "../../schemas";

const checkRouter = new Hono<{
  Variables: {
    session: Session;
    session_key_rotation: boolean;
  };
}>();

checkRouter.get(
  "/",
  async (context, next) => await authMiddleware(undefined, context, next),
  async (context) => {
    const session = context.get("session");
    const userId = session.get("user_id") as string;

    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    const userFound = await userSchema.safeParseAsync(result[0]);

    if (!userFound) {
      return context.json(
        {
          error: "Not Found",
          reason: "User not found.",
        },
        404
      );
    }

    return context.json(userFound, 200);
  }
);

export default checkRouter;
