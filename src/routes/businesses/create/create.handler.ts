import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import businesses, { selectBusinessesSchema } from "@/schemas/business";

import { CreateBusinessRoute } from "./create.route";

const createBusinessHandler: KalimbuRoute<CreateBusinessRoute> = async (
  context
) => {
  const payload = context.req.valid("json");

  const existingBusiness = await database.query.businesses.findFirst({
    where: (businesses, { eq, like, or }) =>
      or(
        eq(businesses.name, payload.name),
        like(businesses.name, payload.name.toLowerCase())
      ),
  });

  if (existingBusiness)
    return context.json(
      { message: "There is already a business with that business name." },
      HttpStatus.CONFLICT
    );

  const business = await database
    .insert(businesses)
    .values(payload)
    .returning();

  return context.json(
    await selectBusinessesSchema.parseAsync(business[0]),
    HttpStatus.OK
  );
};

export default createBusinessHandler;
