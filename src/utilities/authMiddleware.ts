import { Context, Next } from "hono";

import db from "../db";
import { eq } from "drizzle-orm";
import { users } from "../schemas";

export default async function authMiddleware(
  requiredRoles: string[] | undefined,
  context: Context,
  next: Next
) {
  const session = context.get("session");

  if (!session) {
    return context.json(
      {
        error: "Unauthorized",
        reason: "You are not authorized to access this endpoint.",
      },
      401
    );
  }

  const userId = session.get("user_id");

  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  const userFound = result[0];

  if (!userFound) {
    return context.json(
      {
        error: "Unauthorized",
        reason: "You are not authorized to access this endpoint.",
      },
      401
    );
  }

  if (requiredRoles !== undefined) {
    if (!requiredRoles.includes(userFound.role)) {
      return context.json(
        {
          error: "Unauthorized",
          reason: "You are not authorized to access this endpoint.",
        },
        401
      );
    }
  }

  await next();
}
