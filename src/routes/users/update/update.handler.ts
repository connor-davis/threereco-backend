import { eq } from "drizzle-orm";

import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import users, { selectUsersSchema } from "@/schemas/user";

import { UpdateUserRoute } from "./update.route";

const updateUserHandler: KalimbuRoute<UpdateUserRoute> = async (context) => {
  const param = context.req.param();
  const payload = context.req.valid("json");

  const existingUser = await database.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, param.id),
  });

  if (!existingUser)
    return context.json(
      { message: "The user was not found." },
      HttpStatus.NOT_FOUND
    );

  const user = await database
    .update(users)
    .set({
      ...payload,
      mfaEnabled: payload.mfaEnabled || existingUser.mfaEnabled,
    })
    .where(eq(users.id, param.id))
    .returning();

  return context.json(
    await selectUsersSchema.parseAsync(user[0]),
    HttpStatus.OK
  );
};

export default updateUserHandler;
