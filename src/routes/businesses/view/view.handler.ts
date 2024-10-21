import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import { selectBusinessesSchema } from "@/schemas/business";

import { ViewBusinessRoute, ViewBusinessesRoute } from "./view.route";

export const viewBusinessesHandler: KalimbuRoute<ViewBusinessesRoute> = async (
  context
) => {
  const query = context.req.valid("query");

  const businesses = await database.query.businesses.findMany({
    with: {
      user: query.includeUser,
    },
    limit: query.count,
    offset: query.count * (query.page - 1),
  });

  return context.json(
    businesses.map((business) => selectBusinessesSchema.parse(business)),
    HttpStatus.OK
  );
};

export const viewBusinessHandler: KalimbuRoute<ViewBusinessRoute> = async (
  context
) => {
  const params = context.req.valid("param");
  const query = context.req.valid("query");

  const business = await database.query.businesses.findFirst({
    where: (businesses, { eq }) => eq(businesses.id, params.id),
    with: {
      user: query.includeUser,
    },
  });

  if (!business)
    return context.json(
      { message: "The business was not found." },
      HttpStatus.NOT_FOUND
    );

  return context.json(selectBusinessesSchema.parse(business), HttpStatus.OK);
};
