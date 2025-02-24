import { toCsv } from "@iwsio/json-csv-node";
import { asc } from "drizzle-orm";

import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import { collectors } from "@/schemas/collector";

import { ExportCollectorsRoute } from "./export.route";

export const exportCollectorsHandler: KalimbuRoute<
  ExportCollectorsRoute
> = async (context) => {
  const ascCollectors = await database.query.collectors.findMany({
    orderBy: [asc(collectors.firstName), asc(collectors.lastName)],
    with: {
      user: true,
    },
  });

  const csvTest = await toCsv(ascCollectors, {
    fields: [
      {
        name: "firstName",
        label: "First Name",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "lastName",
        label: "Last Name",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "idNumber",
        label: "ID Number",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "phoneNumber",
        label: "Phone Number",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "address",
        label: "Address",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "city",
        label: "City",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "province",
        label: "Province",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "zipCode",
        label: "Zip Code",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "bankName",
        label: "Payment Name",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "bankAccountHolder",
        label: "Payment Account Holder",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "bankAccountNumber",
        label: "Payment Account Number",
        transform: (value) => `${value ?? "--"}`,
      },
      {
        name: "user.email",
        label: "Email",
        transform: (value) => `${value ?? "--"}`,
      },
    ],
    fieldSeparator: ",",
    encoding: "utf-8",
    ignoreHeader: false,
  });

  if (typeof csvTest === "string") {
    context.header("Content-Type", "text/csv");
    context.header(
      "Content-Disposition",
      "attachment; filename=collectors.csv"
    );

    return context.text(csvTest, HttpStatus.OK);
  }

  return context.json(
    {
      message: "Failed to generate collectors export.",
    },
    HttpStatus.INTERNAL_SERVER_ERROR
  );
};
