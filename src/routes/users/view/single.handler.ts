import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuHandler } from "@/lib/types";

import { SingleUserRoute } from "./single.route";

const singleUserHandler: KalimbuHandler<SingleUserRoute> = async (context) => {
  const param = context.req.param();

  const user = await database.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, param.id),
  });

  if (!user)
    return context.json(
      { message: "The user was not found." },
      HttpStatus.NOT_FOUND
    );

  return context.json(user, HttpStatus.OK);
};

export default singleUserHandler;
