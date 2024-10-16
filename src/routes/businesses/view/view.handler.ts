import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuHandler } from "@/lib/types";

import { ViewBusinessesRoute } from "./view.route";

const viewBusinessesHandler: KalimbuHandler<ViewBusinessesRoute> = async (
  context
) => {
  const query = context.req.valid("query");

  if (query.id) {
    const business = await database.query.businesses.findFirst({
      where: (businesses, { eq }) => eq(businesses.id, query.id!),
    });

    if (!business)
      return context.json(
        { message: "The business was not found." },
        HttpStatus.NOT_FOUND
      );

    return context.json(business, HttpStatus.OK);
  } else {
    const businesses = await database.query.businesses.findMany();

    return context.json(businesses, HttpStatus.OK);
  }
};

export default viewBusinessesHandler;
