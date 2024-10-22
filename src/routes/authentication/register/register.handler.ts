import { genSalt, hash } from "bcrypt";

import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import users, { selectUsersSchema } from "@/schemas/user";

import { RegisterRoute } from "./register.route";

const registerHandler: KalimbuRoute<RegisterRoute> = async (context) => {
  const payload = context.req.valid("json");

  const existingUser = await database.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, payload.email),
  });

  if (existingUser)
    return context.json(
      { message: "The user already exists." },
      HttpStatus.CONFLICT
    );

  const passwordSalt = await genSalt(2048);
  const passwordHash = await hash(payload.password, passwordSalt);

  const registeredUser = await database
    .insert(users)
    .values({ ...payload, password: passwordHash })
    .returning();

  return context.json(
    await selectUsersSchema.parseAsync(registeredUser[0]),
    HttpStatus.OK
  );
};

export default registerHandler;
