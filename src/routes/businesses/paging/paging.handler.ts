import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";

import { BusinessesPagingRoute } from "./paging.route";

const businessesPagingHandler: KalimbuRoute<BusinessesPagingRoute> = async (
  context
) => {
  const query = context.req.valid("query");

  const businesses = await database.query.businesses.findMany();

  const pageSize = query.count;
  const totalBusinesses = businesses.length;
  const totalPages = Math.ceil(totalBusinesses / pageSize);

  return context.json(
    {
      totalBusinesses,
      totalPages,
    },
    HttpStatus.OK
  );
};

export default businessesPagingHandler;
