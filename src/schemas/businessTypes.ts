import { pgEnum } from "drizzle-orm/pg-core";

export const businessTypes = pgEnum("business_types", [
  "Recycler",
  "Waste Collector",
  "Buy Back Centre",
]);
