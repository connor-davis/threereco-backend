import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";

import { CollectorsPagingRoute } from "./paging.route";

const collectorsPagingHandler: KalimbuRoute<CollectorsPagingRoute> = async (
  context
) => {
  const query = context.req.valid("query");

  const collectors = await database.query.collectors.findMany();

  const pageSize = query.count;
  const totalCollectors = collectors.length;
  const totalPages = Math.ceil(totalCollectors / pageSize);

  return context.json(
    {
      totalCollectors,
      totalPages,
    },
    HttpStatus.OK
  );
};

export default collectorsPagingHandler;
