import { eq } from "drizzle-orm";

import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import { users } from "@/schemas/user";

import { DeleteUserRoute } from "./delete.route";

const deleteUserHandler: KalimbuRoute<DeleteUserRoute> = async (context) => {
  const param = context.req.param();

  const user = await database.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, param.id),
  });

  if (!user)
    return context.json(
      { message: "The user was not found." },
      HttpStatus.NOT_FOUND
    );

  await database.delete(users).where(eq(users.id, param.id));

  return context.text("ok", HttpStatus.OK);
};

export default deleteUserHandler;
