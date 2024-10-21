import { eq } from "drizzle-orm";

import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import businesses, { selectBusinessesSchema } from "@/schemas/business";

import { UpdateBusinessRoute } from "./update.route";

const updateBusinessHandler: KalimbuRoute<UpdateBusinessRoute> = async (
  context
) => {
  const params = context.req.valid("param");
  const payload = context.req.valid("json");

  const existingBusiness = await database.query.businesses.findFirst({
    where: (businesses, { eq }) => eq(businesses.id, params.id),
  });

  const existingBusinessWithName = await database.query.businesses.findFirst({
    where: (businesses, { eq, like, or, and, not }) =>
      and(
        or(
          eq(businesses.name, payload.name),
          like(businesses.name, payload.name.toLowerCase())
        ),
        not(eq(businesses.id, params.id))
      ),
  });

  if (!existingBusiness)
    return context.json(
      { message: "The business was not found." },
      HttpStatus.NOT_FOUND
    );

  if (existingBusinessWithName)
    return context.json(
      { message: "There is already a business with that business name." },
      HttpStatus.CONFLICT
    );

  const business = await database
    .update(businesses)
    .set(payload)
    .where(eq(businesses.id, params.id))
    .returning();

  return context.json(
    await selectBusinessesSchema.parseAsync(business[0]),
    HttpStatus.OK
  );
};

export default updateBusinessHandler;
