import { sql } from "drizzle-orm";

import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import { selectUsersSchema } from "@/schemas/user";

import { ViewUserRoute, ViewUsersRoute } from "./view.route";

export const viewUsersHandler: KalimbuRoute<ViewUsersRoute> = async (
  context
) => {
  const query = context.req.valid("query");

  const users = await database.query.users.findMany({
    where: (users, { eq, and }) =>
      and(query.role ? eq(users.role, query.role) : undefined),
    limit: query.count,
    offset: query.count * (query.page - 1),
    orderBy: (_, { asc }) => asc(sql`lower(email)`),
  });

  return context.json(
    users.map((user) => selectUsersSchema.parse(user)),
    HttpStatus.OK
  );
};

export const viewUserHandler: KalimbuRoute<ViewUserRoute> = async (context) => {
  const param = context.req.valid("param");

  const user = await database.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, param.id),
  });

  if (!user)
    return context.json(
      {
        message: "The user was not found.",
      },
      HttpStatus.NOT_FOUND
    );

  return context.json(selectUsersSchema.parse(user), HttpStatus.OK);
};
