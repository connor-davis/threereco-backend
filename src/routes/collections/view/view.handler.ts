import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import { selectCollectionsSchema } from "@/schemas/collection";

import { ViewCollectionsRoute } from "./view.route";

const viewCollectionsHandler: KalimbuRoute<ViewCollectionsRoute> = async (
  context
) => {
  const session = context.var.session;
  const userId = session.get("user_id") as string;
  const userRole = session.get("user_role") as string;

  const query = context.req.valid("query");

  const business = await database.query.businesses.findFirst({
    where: (businesses, { eq, and }) =>
      and(userRole === "business" ? eq(businesses.userId, userId) : undefined),
  });

  if (!query.id) {
    const collections = await database.query.collections.findMany({
      where: (collections, { eq, and }) =>
        and(
          userRole === "business"
            ? eq(collections.businessId, business!.id)
            : undefined
        ),
      with: {
        business: query.includeBusiness
          ? {
              with: {
                user: query.includeBusinessUser,
              },
            }
          : false,
        collector: query.includeCollector
          ? {
              with: {
                user: query.includeCollectorUser,
              },
            }
          : false,
        product: query.includeProduct
          ? {
              with: {
                business: query.includeProductBusiness
                  ? {
                      with: {
                        user: query.includeProductBusinessUser,
                      },
                    }
                  : false,
              },
            }
          : false,
      },
      limit: query.count,
      offset: query.count * (query.page - 1),
    });

    return context.json(
      collections.map((collection) =>
        selectCollectionsSchema.parse(collection)
      ),
      HttpStatus.OK
    );
  } else {
    const collection = await database.query.collections.findFirst({
      where: (collections, { eq, and }) =>
        and(
          eq(collections.id, query.id!),
          userRole === "business"
            ? eq(collections.businessId, business!.id)
            : undefined
        ),
      with: {
        business: query.includeBusiness
          ? {
              with: {
                user: query.includeBusinessUser,
              },
            }
          : false,
        collector: query.includeCollector
          ? {
              with: {
                user: query.includeCollectorUser,
              },
            }
          : false,
        product: query.includeProduct
          ? {
              with: {
                business: query.includeProductBusiness
                  ? {
                      with: {
                        user: query.includeProductBusinessUser,
                      },
                    }
                  : false,
              },
            }
          : false,
      },
    });

    return context.json(
      selectCollectionsSchema.parse(collection),
      HttpStatus.OK
    );
  }
};

export default viewCollectionsHandler;
