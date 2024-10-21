import { eq } from "drizzle-orm";

import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import businesses from "@/schemas/business";
import { collections } from "@/schemas/collection";
import { products } from "@/schemas/products";

import { DeleteBusinessRoute } from "./delete.route";

const deleteBusinessHandler: KalimbuRoute<DeleteBusinessRoute> = async (
  context
) => {
  const params = context.req.valid("param");

  const business = await database.query.businesses.findFirst({
    where: (businesses, { eq }) => eq(businesses.id, params.id),
  });

  if (!business)
    return context.json(
      { message: "The business was not found." },
      HttpStatus.NOT_FOUND
    );

  await database
    .delete(collections)
    .where(eq(collections.businessId, params.id));
  await database.delete(products).where(eq(products.businessId, params.id));
  await database.delete(businesses).where(eq(businesses.id, params.id));

  return context.text("ok", HttpStatus.OK);
};

export default deleteBusinessHandler;
