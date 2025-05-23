import { eq } from "drizzle-orm";

import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import { users } from "@/schemas/user";

import { DeleteAccountRoute } from "./deleteAccount.route";

const deleteAccountHandler: KalimbuRoute<DeleteAccountRoute> = async (
  context
) => {
  const payload = context.req.valid("json");

  const user = await database.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, payload.email),
  });

  if (!user)
    return context.json(
      { message: "The user was not found." },
      HttpStatus.NOT_FOUND
    );

  await database.delete(users).where(eq(users.id, user.id));

  return context.text("ok", HttpStatus.OK);
};

export default deleteAccountHandler;
