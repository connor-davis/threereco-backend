import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";

import { CollectionsPagingRoute } from "./paging.route";

const collectionsPagingHandler: KalimbuRoute<CollectionsPagingRoute> = async (
  context
) => {
  const query = context.req.valid("query");

  const collections = await database.query.collections.findMany();

  const pageSize = query.count;
  const totalCollections = collections.length;
  const totalPages = Math.ceil(totalCollections / pageSize);

  return context.json(
    {
      totalCollections,
      totalPages,
    },
    HttpStatus.OK
  );
};

export default collectionsPagingHandler;
