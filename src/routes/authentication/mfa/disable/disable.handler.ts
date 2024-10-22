import { eq } from "drizzle-orm";

import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import users from "@/schemas/user";

import { DisableMfaRoute } from "./disable.route";

const disableMfaHandler: KalimbuRoute<DisableMfaRoute> = async (context) => {
  const query = context.req.valid("query");

  const user = await database.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, query.id),
  });

  if (!user)
    return context.json(
      { message: "The user was not found." },
      HttpStatus.NOT_FOUND
    );

  await database
    .update(users)
    .set({ mfaSecret: null, mfaEnabled: false, mfaVerified: false })
    .where(eq(users.id, query.id));

  return context.text("ok", HttpStatus.OK);
};

export default disableMfaHandler;
