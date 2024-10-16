import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";

import { ViewUsersRoute } from "./view.route";

const viewUsersHandler: KalimbuRoute<ViewUsersRoute> = async (context) => {
  const query = context.req.valid("query");

  if (query.id) {
    const user = await database.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, query.id!),
    });

    if (!user)
      return context.json(
        {
          message: "The user was not found.",
        },
        HttpStatus.NOT_FOUND
      );

    return context.json(user, HttpStatus.OK);
  } else {
    const users = await database.query.users.findMany();

    return context.json(users, HttpStatus.OK);
  }
};

export default viewUsersHandler;
