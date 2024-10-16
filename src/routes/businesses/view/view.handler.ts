import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";

import { ViewBusinessesRoute } from "./view.route";

const viewBusinessesHandler: KalimbuRoute<ViewBusinessesRoute> = async (
  context
) => {
  const query = context.req.valid("query");

  if (query.id) {
    const business = await database.query.businesses.findFirst({
      where: (businesses, { eq }) => eq(businesses.id, query.id!),
      with: {
        user: query.includeUser,
      },
    });

    if (!business)
      return context.json(
        { message: "The business was not found." },
        HttpStatus.NOT_FOUND
      );

    return context.json(business, HttpStatus.OK);
  } else {
    const businesses = await database.query.businesses.findMany({
      with: {
        user: query.includeUser,
      },
    });

    return context.json(businesses, HttpStatus.OK);
  }
};

export default viewBusinessesHandler;
