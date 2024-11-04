import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import { collections, selectCollectionsSchema } from "@/schemas/collection";

import { CreateCollectionRoute } from "./create.route";

const createCollectionHandler: KalimbuRoute<CreateCollectionRoute> = async (
  context
) => {
  const session = context.var.session;
  const userId = session.get("user_id") as string;
  const userRole = session.get("user_role") as string;

  const payload = context.req.valid("json");

  const business = await database.query.businesses.findFirst({
    where: (businesses, { eq, and }) =>
      and(userRole === "business" ? eq(businesses.userId, userId) : undefined),
  });

  const collection = await database
    .insert(collections)
    .values({
      ...payload,
      businessId:
        userRole === "business"
          ? business
            ? business.id
            : payload.businessId!
          : payload.businessId!,
    })
    .returning();

  return context.json(
    selectCollectionsSchema.parse(collection[0]),
    HttpStatus.OK
  );
};

export default createCollectionHandler;
