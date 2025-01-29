import { genSalt, hash } from "bcrypt";

import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import { selectUsersSchema, users } from "@/schemas/user";

import { CreateUserRoute } from "./create.route";

const createUserHandler: KalimbuRoute<CreateUserRoute> = async (context) => {
  const payload = context.req.valid("json");

  const existingUser = await database.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, payload.email),
  });

  if (existingUser)
    return context.json(
      { message: "The user already exists." },
      HttpStatus.CONFLICT
    );

  if (!payload.role)
    return context.json(
      { message: "Please provide a role for the user." },
      HttpStatus.BAD_REQUEST
    );

  const passwordSalt = await genSalt(2048);
  const passwordHash = await hash(payload.password, passwordSalt);

  const user = await database
    .insert(users)
    .values({ ...payload, password: passwordHash })
    .returning();

  return context.json(
    await selectUsersSchema.parseAsync(user[0]),
    HttpStatus.OK
  );
};

export default createUserHandler;
