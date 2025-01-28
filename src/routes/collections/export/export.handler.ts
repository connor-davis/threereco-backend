import { toCsv } from "@iwsio/json-csv-node";
import { and, asc, eq, gt, lte } from "drizzle-orm";

import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import { collections } from "@/schemas/collection";

import { ExportCollectionsRoute } from "./export.route";

const exportCollectionsHandler: KalimbuRoute<ExportCollectionsRoute> = async (
  context
) => {
  const session = context.var.session;
  const userId = session.get("user_id") as string;
  const userRole = session.get("user_role") as string;

  console.log(userRole);

  const query = context.req.valid("query");

  const business = await database.query.businesses.findFirst({
    where: (businesses, { eq, and }) =>
      and(userRole === "business" ? eq(businesses.userId, userId) : undefined),
  });

  const startDate = query.startDate;

  startDate.setHours(0);
  startDate.setMinutes(0);
  startDate.setSeconds(0);
  startDate.setMilliseconds(0);

  const endDate = query.endDate;

  endDate.setHours(23);
  endDate.setMinutes(59);
  endDate.setSeconds(59);
  endDate.setMilliseconds(999);

  const ascCollections = await database.query.collections.findMany({
    where:
      userRole === "business"
        ? and(
            eq(collections.businessId, business!.id),
            lte(collections.createdAt, endDate),
            gt(collections.createdAt, startDate)
          )
        : and(
            lte(collections.createdAt, endDate),
            gt(collections.createdAt, startDate)
          ),
    orderBy: asc(collections.createdAt),
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

  const csvTest = await toCsv(ascCollections, {
    fields: [
      {
        name: "business.name",
        label: "Business Name",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "business.type",
        label: "Business Type",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "business.description",
        label: "Business Description",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "business.phoneNumber",
        label: "Business Phone Number",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "business.address",
        label: "Business Address",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "business.city",
        label: "Business City",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "business.province",
        label: "Business Province",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "business.zipCode",
        label: "Business Zip Code",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "business.user.email",
        label: "Business Email",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "collector.firstName",
        label: "Collector First Name",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "collector.lastName",
        label: "Collector Last Name",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "collector.idNumber",
        label: "Collector ID Number",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "collector.phoneNumber",
        label: "Collector Phone Number",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "collector.address",
        label: "Collector Address",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "collector.city",
        label: "Collector City",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "collector.province",
        label: "Collector Province",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "collector.zipCode",
        label: "Collector Zip Code",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "collector.bankName",
        label: "Collector Bank Name",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "collector.bankAccountHolder",
        label: "Collector Bank Account Holder",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "collector.bankAccountNumber",
        label: "Collector Bank Account Number",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "collector.user.email",
        label: "Collector Email",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "product.name",
        label: "Product Name",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "product.gwCode",
        label: "Product GW Code",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "product.carbonFactor",
        label: "Product tCO2/ton Factor",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "product.price",
        label: "Product Price",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "weight",
        label: "Collection Weight",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "createdAt",
        label: "Collection Date",
        transform: (value) => `${value ?? "--"}`,
      },
    ],
    fieldSeparator: ",",
    encoding: "utf-8",
    ignoreHeader: false,
  });

  return context.text(`${csvTest}`, HttpStatus.OK);
};

export default exportCollectionsHandler;
