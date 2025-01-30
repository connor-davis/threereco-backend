import { and, eq } from "drizzle-orm";

import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import { collections, selectCollectionsSchema } from "@/schemas/collection";
import { transactions } from "@/schemas/transaction";

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

  const product = await database.query.products.findFirst({
    where: (products, { eq }) => eq(products.id, payload.productId),
  });

  if (!product) {
    return context.json(
      {
        message: "Product not found",
      },
      HttpStatus.NOT_FOUND
    );
  }

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
      createdAt: payload.createdAt ?? new Date(),
      businessId:
        userRole === "business"
          ? business
            ? business.id
            : payload.businessId!
          : payload.businessId!,
    })
    .where(eq(collections.id, params.id))
    .returning();

  await database
    .update(transactions)
    .set({
      buyerId:
        userRole === "business"
          ? business
            ? business.id
            : payload.businessId!
          : payload.businessId!,
      sellerId: payload.collectorId ?? existingCollection.collectorId,
      productId: payload.productId ?? existingCollection.productId,
      weight: payload.weight ?? existingCollection.weight,
      amount: product.price,
    })
    .where(
      and(
        eq(transactions.buyerId, existingCollection.businessId),
        eq(transactions.sellerId, existingCollection.collectorId),
        eq(transactions.productId, existingCollection.productId)
      )
    );

  return context.json(
    selectCollectionsSchema.parse(collection[0]),
    HttpStatus.OK
  );
};

export default updateCollectionHandler;
