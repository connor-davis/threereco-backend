import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import { selectBusinessesSchema } from "@/schemas/business";

import { ViewBusinessesRoute } from "./view.route";

const viewBusinessesHandler: KalimbuRoute<ViewBusinessesRoute> = async (
  context
) => {
  const query = context.req.valid("query");

  console.log(query);

  if (!query.id) {
    const businesses = await database.query.businesses.findMany({
      with: {
        user: query.includeUser,
      },
    });

    return context.json(
      businesses.map((business) => selectBusinessesSchema.parse(business)),
      HttpStatus.OK
    );
  } else {
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

    return context.json(selectBusinessesSchema.parse(business), HttpStatus.OK);
  }
};

export default viewBusinessesHandler;
