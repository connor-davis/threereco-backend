import { genSalt, hash } from "bcrypt";
import { parse } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { readFile, readdir } from "fs/promises";
import path from "path";

import database from "@/lib/database";
import businesses from "@/schemas/business";
import { collections } from "@/schemas/collection";
import collectors from "@/schemas/collector";
import { products } from "@/schemas/products";
import users from "@/schemas/user";

const importDir = path.join(process.cwd(), "import");
const importFiles = await readdir(importDir);

for (const importFile of importFiles) {
  const importFilePath = path.join(importDir, importFile);

  const businessPasswordSalt = await genSalt(2048);
  const businessPasswordHash = await hash("@Business#$%", businessPasswordSalt);

  const collectorPasswordSalt = await genSalt(2048);
  const collectorPasswordHash = await hash(
    "@Collector#$%",
    collectorPasswordSalt
  );

  const csvData = await readFile(importFilePath, { encoding: "utf-8" });
  const csvRows = csvData.split("\n");

  const csvDataRows = csvRows.slice(1, csvRows.length - 1);

  for (let i = 0; i < csvDataRows.length; i++) {
    console.log("📦 Saving csv row " + (i + 1));

    const row: any = csvDataRows[i]
      .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .map((cell) => cell.replaceAll('"', "").replaceAll("\r", "").trim());

    let business = await database.query.businesses.findFirst({
      where: (businesses, { eq }) => eq(businesses.name, row[0]),
    });

    if (business === undefined) {
      const newUser = await database
        .insert(users)
        .values({
          email: row[8],
          password: businessPasswordHash,
          active: true,
          role: "business",
        })
        .returning({ id: users.id });

      business = (
        await database
          .insert(businesses)
          .values({
            name: row[0],
            type: row[1],
            description: row[2],
            phoneNumber: row[3],
            address: row[4],
            city: row[5],
            province: row[6],
            zipCode: row[7],
            userId: newUser[0].id,
          })
          .returning()
      )[0];
    }

    let collector = await database.query.collectors.findFirst({
      where: (collectors, { eq }) => eq(collectors.firstName, row[9]),
    });

    if (collector === undefined) {
      const newUser = await database
        .insert(users)
        .values({
          email: row[20],
          password: collectorPasswordHash,
          active: true,
          role: "collector",
        })
        .returning({ id: users.id });

      collector = (
        await database
          .insert(collectors)
          .values({
            firstName: row[9],
            lastName: row[10],
            idNumber: Number(row[11]).toString(),
            phoneNumber: row[12],
            address: row[13],
            city: row[14],
            province: row[15],
            zipCode: Number(row[16]).toString(),
            bankName: row[17],
            bankAccountHolder: row[18],
            bankAccountNumber: row[19],
            userId: newUser[0].id,
          })
          .returning()
      )[0];
    }

    let product = await database.query.products.findFirst({
      where: (products, { eq }) => eq(products.name, row[21]),
    });

    if (product === undefined) {
      product = (
        await database
          .insert(products)
          .values({
            name: row[21],
            gwCode: row[22],
            carbonFactor: row[23],
            price: Number(row[24].replaceAll("R ", "")).toString(),
            businessId: business.id,
          })
          .returning()
      )[0];
    }

    const weight = Number(row[25]).toString();
    const createdAt = toZonedTime(
      parse(
        row[26].replace(/(\d+)(st|nd|rd|th)/, "$1"),
        "MMMM dd, yyyy",
        new Date()
      ),
      "Africa/Johannesburg"
    );

    let collection = await database.query.collections.findFirst({
      where: (collections, { eq, and }) =>
        and(
          eq(collections.businessId, business.id),
          eq(collections.collectorId, collector.id),
          eq(collections.productId, product.id),
          eq(collections.weight, weight),
          eq(collections.createdAt, createdAt)
        ),
    });

    if (collection === undefined) {
      await database.insert(collections).values({
        businessId: business.id,
        collectorId: collector.id,
        productId: product.id,
        weight,
        createdAt,
      });
    }
  }
}

process.exit(1);
