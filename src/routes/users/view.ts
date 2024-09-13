import { Context, Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { roles, users } from "../../schemas";

import { UserRoles } from "../../utilities/types";
import authMiddleware from "../../utilities/authMiddleware";
import db from "../../db";
import { userSchema } from "../../models/user";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const viewUsersRouter = new Hono();

const querySchema = z.object({
  role: z.enum(roles.enumValues).optional(),
  id: z.string().uuid().optional(),
});

viewUsersRouter.get(
  "/",
  async (context, next) =>
    await authMiddleware(
      ["System Admin", "Admin", "Staff", "Business", "Collector"],
      context,
      next
    ),
  zValidator("query", querySchema),
  async (context) => {
    const { role, id } = await querySchema.parseAsync(context.req.query());

    if (role) return await handleUsersForRole(role, context);
    if (role && id) return await handleUserWithRole(id, role, context);
    if (id) return await handleUser(id, context);

    return await handleUsers(context);
  }
);

const handleUsers = async (context: Context) => {
  const usersResult = await db.select().from(users);

  return context.json(
    [...usersResult.map((user) => userSchema.parse(user))],
    200
  );
};

const handleUser = async (id: string, context: Context) => {
  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  const userFound = userResult[0];

  if (!userFound) {
    return context.json(
      {
        error: "Not Found",
        reason: "User not found.",
      },
      404
    );
  }

  return context.json(
    {
      ...userSchema.parse(userFound),
    },
    200
  );
};

const handleUserWithRole = async (
  id: string,
  role: UserRoles,
  context: Context
) => {
  const userResult = await db
    .select()
    .from(users)
    .where(and(eq(users.id, id), eq(users.role, role)))
    .limit(1);
  const userFound = userResult[0];

  if (!userFound) {
    return context.json(
      {
        error: "Not Found",
        reason: "User not found.",
      },
      404
    );
  }

  return context.json(
    {
      ...userSchema.parse(userFound),
    },
    200
  );
};

const handleUsersForRole = async (role: UserRoles, context: Context) => {
  const usersResult = await db.select().from(users).where(eq(users.role, role));

  return context.json(
    [...usersResult.map((user) => userSchema.parse(user))],
    200
  );
};

export default viewUsersRouter;
