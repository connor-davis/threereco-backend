import { eq } from "drizzle-orm";

import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import { selectUsersSchema, users } from "@/schemas/user";

import { CheckRoute } from "./check.route";

const checkHandler: KalimbuRoute<CheckRoute> = async (context) => {
  const session = context.var.session;
  const userId = session.get("user_id") as string;

  const userResults = await database
    .select()
    .from(users)
    .where(eq(users.id, userId));

  return context.json(
    await selectUsersSchema.parseAsync(userResults[0]),
    HttpStatus.OK
  );
};

export default checkHandler;
