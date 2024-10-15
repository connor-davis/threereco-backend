import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuHandler } from "@/lib/types";

import { ListUsersRoute } from "./list.route";

const listUsersHandler: KalimbuHandler<ListUsersRoute> = async (context) => {
  const users = await database.query.users.findMany();

  return context.json(users, HttpStatus.OK);
};

export default listUsersHandler;
