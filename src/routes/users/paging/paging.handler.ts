import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";

import { UsersPagingRoute } from "./paging.route";

const usersPagingHandler: KalimbuRoute<UsersPagingRoute> = async (context) => {
  const query = context.req.valid("query");

  const users = await database.query.users.findMany();

  const pageSize = query.count;
  const totalUsers = users.length;
  const totalPages = Math.ceil(totalUsers / pageSize);

  return context.json(
    {
      totalUsers,
      totalPages,
    },
    HttpStatus.OK
  );
};

export default usersPagingHandler;
