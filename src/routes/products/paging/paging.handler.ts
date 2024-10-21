import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";

import { ProductsPagingRoute } from "./paging.route";

const productsPagingHandler: KalimbuRoute<ProductsPagingRoute> = async (
  context
) => {
  const query = context.req.valid("query");

  const products = await database.query.products.findMany();

  const pageSize = query.count;
  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / pageSize);

  return context.json(
    {
      totalProducts,
      totalPages,
    },
    HttpStatus.OK
  );
};

export default productsPagingHandler;
