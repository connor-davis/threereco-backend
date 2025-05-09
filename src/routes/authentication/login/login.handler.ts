import { compare } from "bcrypt";
import { eq } from "drizzle-orm";

import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import { selectUsersSchema, users } from "@/schemas/user";

import { LoginRoute } from "./login.route";

const loginHandler: KalimbuRoute<LoginRoute> = async (context) => {
  const payload = context.req.valid("json");

  const existingUser = await database.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, payload.email),
  });

  if (!existingUser)
    return context.json(
      { message: "The user was not found." },
      HttpStatus.NOT_FOUND
    );

  const passwordMatches = await compare(
    payload.password,
    existingUser.password
  );

  if (!passwordMatches)
    return context.json(
      { message: "Invalid email or password." },
      HttpStatus.UNAUTHORIZED
    );

  const session = context.var.session;

  session.set("user_id", existingUser.id);
  session.set("user_role", existingUser.role);

  const loggedInUser = await database
    .update(users)
    .set({ mfaVerified: false })
    .where(eq(users.id, existingUser.id))
    .returning();

  return context.json(
    await selectUsersSchema.parseAsync(loggedInUser[0]),
    HttpStatus.OK
  );
};

export default loginHandler;
