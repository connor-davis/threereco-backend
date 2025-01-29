import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import { collections, selectCollectionsSchema } from "@/schemas/collection";
import { transactions } from "@/schemas/transaction";

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

  const [collection] = await database
    .insert(collections)
    .values({
      ...payload,
      createdAt: payload.createdAt ?? new Date(),
      businessId:
        userRole === "business"
          ? business
            ? business.id
            : payload.businessId!
          : payload.businessId!,
    })
    .returning();

  await database.insert(transactions).values({
    buyerId:
      userRole === "business"
        ? business
          ? business.id
          : payload.businessId!
        : payload.businessId!,
    sellerId: payload.collectorId,
    productId: payload.productId,
    weight: payload.weight,
  });

  return context.json(selectCollectionsSchema.parse(collection), HttpStatus.OK);
};

export default createCollectionHandler;
