import { zValidator } from "@hono/zod-validator";
import { aliasedTable, and, eq, gte, lte } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import db from "../../db";
import {
  businesses,
  collections,
  collectors,
  products,
  users,
} from "../../schemas";
import { flattenObject } from "../../utilities";
import authMiddleware from "../../utilities/authMiddleware";
import { format } from "date-fns";

const exportCollectionsRouter = new Hono();

const QuerySchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

exportCollectionsRouter.get(
  "/",
  async (context, next) =>
    await authMiddleware(["System Admin", "Admin"], context, next),
  zValidator("query", QuerySchema),
  async (context) => {
    const { startDate, endDate } = await QuerySchema.parseAsync(
      context.req.query()
    );

    const businessUser = aliasedTable(users, "business_user");
    const collectorUser = aliasedTable(users, "collector_user");

    const results: any = await db
      .select()
      .from(collections)
      .leftJoin(businesses, eq(collections.businessId, businesses.id))
      .leftJoin(collectors, eq(collections.collectorId, collectors.id))
      .leftJoin(products, eq(collections.productId, products.id))
      .leftJoin(businessUser, eq(businesses.userId, businessUser.id))
      .leftJoin(collectorUser, eq(collectors.userId, collectorUser.id))
      .where(
        and(
          gte(collections.createdAt, startDate),
          lte(collections.createdAt, endDate)
        )
      );

    let csvString =
      '"Business Name","Business Type","Business Description","Business Phone Number","Business Address","Business City","Business Province","Business Zip Code","Business Email","Collector First Name","Collector Last Name","Collector ID Number","Collector Phone Number","Collector Address","Collector City","Collector Province","Collector Zip Code","Collector Bank Name","Collector Bank Account Holder","Collector Bank Account Number","Collector Email","Product Name","Product GW Code","Product tCO2/ton Factor","Product Price","Collection Weight","Collection Date"\n';

    for (const result of results) {
      if (!result.businesses) continue;
      if (!result.collectors) continue;
      if (!result.products) continue;

      csvString += `"${result.businesses.name}","${result.businesses.type}","${
        result.businesses.description
      }","${result.businesses.phoneNumber}","${result.businesses.address}","${
        result.businesses.city
      }","${result.businesses.province}","${result.businesses.zipCode}","${
        result.business_user?.email ?? "--"
      }","${result.collectors.firstName}","${result.collectors.lastName}","${
        result.collectors.idNumber
      }","${result.collectors.phoneNumber}","${result.collectors.address}","${
        result.collectors.city
      }","${result.collectors.province}","${result.collectors.zipCode}","${
        result.collectors.bankName
      }","${result.collectors.bankAccountHolder}","${
        result.collectors.bankAccountNumber
      }","${result.collector_user?.email ?? "--"}","${result.products.name}","${
        result.products.gwCode
      }","${result.products.carbonFactor}","${result.products.price}","${
        result.collections.weight
      }","${format(result.collections.createdAt, "PPP")}"\n`;
    }

    return context.text(csvString, 200);
  }
);

export default exportCollectionsRouter;
