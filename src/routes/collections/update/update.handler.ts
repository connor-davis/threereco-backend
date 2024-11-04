import { eq } from "drizzle-orm";

import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import { collections, selectCollectionsSchema } from "@/schemas/collection";

import { UpdateCollectionRoute } from "./update.route";

const updateCollectionHandler: KalimbuRoute<UpdateCollectionRoute> = async (
  context
) => {
  const session = context.var.session;
  const userId = session.get("user_id") as string;
  const userRole = session.get("user_role") as string;

  const params = context.req.valid("param");
  const payload = context.req.valid("json");

  const business = await database.query.businesses.findFirst({
    where: (businesses, { eq, and }) =>
      and(userRole === "business" ? eq(businesses.userId, userId) : undefined),
  });

  const existingCollection = await database.query.collections.findFirst({
    where: (collections, { eq }) => eq(collections.id, params.id),
  });

  if (!existingCollection)
    return context.json(
      { message: "The collection was not found." },
      HttpStatus.NOT_FOUND
    );

  const collection = await database
    .update(collections)
    .set({
      ...payload,
      businessId: userRole === "business" ? business!.id : payload.businessId!,
    })
    .where(eq(collections.id, params.id))
    .returning();

  return context.json(
    selectCollectionsSchema.parse(collection[0]),
    HttpStatus.OK
  );
};

export default updateCollectionHandler;
