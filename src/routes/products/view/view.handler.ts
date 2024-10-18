import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import { selectProductsSchema } from "@/schemas/products";

import { ViewProductsRoute } from "./view.route";

const viewProductsHandler: KalimbuRoute<ViewProductsRoute> = async (
  context
) => {
  const session = context.var.session;
  const userId = session.get("user_id") as string;
  const userRole = session.get("user_role") as string;

  const query = context.req.valid("query");

  const business = await database.query.businesses.findFirst({
    where: (businesses, { and, eq }) =>
      and(userRole === "business" ? eq(businesses.id, userId) : undefined),
  });

  if (!query.id) {
    const products = await database.query.products.findMany({
      where: (products, { and, eq }) =>
        and(
          userRole === "business"
            ? eq(products.businessId, business!.id) // If the user is a business user, only return the users products.
            : undefined
        ),
      with: {
        business: query.includeBusiness,
      },
    });

    return context.json(
      products.map((product) => selectProductsSchema.parse(product)),
      HttpStatus.OK
    );
  } else {
    const product = await database.query.products.findFirst({
      where: (products, { and, eq }) =>
        and(
          eq(products.id, query.id!),
          userRole === "business"
            ? eq(products.businessId, business!.id) // If the user is a business user, only return the users products.
            : undefined
        ),
      with: {
        business: query.includeBusiness,
      },
    });

    return context.json(selectProductsSchema.parse(product), HttpStatus.OK);
  }
};

export default viewProductsHandler;
