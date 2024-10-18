import { format } from "date-fns";

import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import { selectCollectionsSchema } from "@/schemas/collection";

import { ExportCollectionsRoute } from "./export.route";

const exportCollectionsHandler: KalimbuRoute<ExportCollectionsRoute> = async (
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

  const collections = await database.query.collections.findMany({
    where: (collections, { eq, and, gte, lte }) =>
      and(
        userRole === "business"
          ? eq(collections.businessId, business!.id)
          : undefined,
        lte(collections.createdAt, query.endDate),
        gte(collections.createdAt, query.startDate)
      ),
    orderBy: (collections, { asc }) => asc(collections.createdAt),
    with: {
      business: {
        with: {
          user: true,
        },
      },
      collector: {
        with: {
          user: true,
        },
      },
      product: {
        with: {
          business: {
            with: {
              user: true,
            },
          },
        },
      },
    },
  });

  let csvString =
    '"Business Name","Business Type","Business Description","Business Phone Number","Business Address","Business City","Business Province","Business Zip Code","Business Email","Collector First Name","Collector Last Name","Collector ID Number","Collector Phone Number","Collector Address","Collector City","Collector Province","Collector Zip Code","Collector Bank Name","Collector Bank Account Holder","Collector Bank Account Number","Collector Email","Product Name","Product GW Code","Product tCO2/ton Factor","Product Price","Collection Weight","Collection Date"\n';

  for (const collection of collections.map((collection) =>
    selectCollectionsSchema.parse(collection)
  )) {
    csvString += `"${collection.business?.name ?? "--"}","${collection.business?.type ?? "--"}","${
      collection.business?.description ?? "--"
    }","${collection.business?.phoneNumber ?? "--"}","${collection.business?.address ?? "--"}","${
      collection.business?.city ?? "--"
    }","${collection.business?.province ?? "--"}","${collection.business?.zipCode ?? "--"}","${
      collection.business?.user?.email ?? "--"
    }","${collection.collector?.firstName ?? "--"}","${collection.collector?.lastName ?? "--"}","${
      collection.collector?.idNumber ?? "--"
    }","${collection.collector?.phoneNumber ?? "--"}","${collection.collector?.address ?? "--"}","${
      collection.collector?.city ?? "--"
    }","${collection.collector?.province ?? "--"}","${collection.collector?.zipCode ?? "--"}","${
      collection.collector?.bankName ?? "--"
    }","${collection.collector?.bankAccountHolder ?? "--"}","${
      collection.collector?.bankAccountNumber ?? "--"
    }","${collection.collector?.user?.email ?? "--"}","${collection.product?.name ?? "--"}","${
      collection.product?.gwCode ?? "--"
    }","${collection.product?.carbonFactor ?? "--"}","${collection.product?.price ?? "--"}","${
      collection.weight ?? "--"
    }","${collection.createdAt ? format(collection.createdAt, "PPP") : "--"}"\n`;
  }

  return context.text(csvString, HttpStatus.OK);
};

export default exportCollectionsHandler;
