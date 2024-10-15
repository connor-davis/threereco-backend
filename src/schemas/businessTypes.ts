import { pgEnum } from "drizzle-orm/pg-core";

const businessTypes = pgEnum("business_types", [
  "Recycler",
  "Waste Collector",
  "Buy Back Centre",
]);

export default businessTypes;
