import { eq } from "drizzle-orm";

import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import businesses, { selectBusinessesSchema } from "@/schemas/business";

import { UpdateBusinessRoute } from "./update.route";

const updateBusinessHandler: KalimbuRoute<UpdateBusinessRoute> = async (
  context
) => {
  const query = context.req.valid("query");
  const payload = context.req.valid("json");

  const existingBusiness = await database.query.businesses.findFirst({
    where: (businesses, { eq }) => eq(businesses.id, query.id),
  });

  if (!existingBusiness)
    return context.json(
      { message: "The business was not found." },
      HttpStatus.NOT_FOUND
    );

  const business = await database
    .update(businesses)
    .set(payload)
    .where(eq(businesses.id, query.id))
    .returning();

  return context.json(
    await selectBusinessesSchema.parseAsync(business[0]),
    HttpStatus.OK
  );
};
