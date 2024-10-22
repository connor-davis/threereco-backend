import { eq } from "drizzle-orm";

import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import businesses from "@/schemas/business";
import { collections } from "@/schemas/collection";
import collectors from "@/schemas/collector";
import { products } from "@/schemas/products";
import users from "@/schemas/user";

import { DeleteAccountRoute } from "./deleteAccount.route";

const deleteAccountHandler: KalimbuRoute<DeleteAccountRoute> = async (
  context
) => {
  const payload = context.req.valid("json");

  const user = await database.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, payload.email),
  });

  if (!user)
    return context.json(
      { message: "The user was not found." },
      HttpStatus.NOT_FOUND
    );

  const business = await database.query.businesses.findFirst({
    where: (businesses, { eq }) => eq(businesses.userId, user.id),
  });

  const collector = await database.query.collectors.findFirst({
    where: (collectors, { eq }) => eq(collectors.userId, user.id),
  });

  if (business) {
    await database.delete(products).where(eq(products.businessId, business.id));

    await database
      .delete(collections)
      .where(eq(collections.businessId, business.id));

    await database.delete(businesses).where(eq(businesses.userId, business.id));
  }

  if (collector) {
    const collection = await database.query.collections.findFirst({
      where: (collections, { eq }) => eq(collections.collectorId, user.id),
    });

    if (collection)
      await database
        .delete(products)
        .where(eq(products.id, collection.productId));

    await database
      .delete(collections)
      .where(eq(collections.collectorId, collector.id));

    await database.delete(collectors).where(eq(collectors.userId, user.id));
  }

  await database.delete(users).where(eq(users.id, user.id));

  return context.text("ok", HttpStatus.OK);
};

export default deleteAccountHandler;
