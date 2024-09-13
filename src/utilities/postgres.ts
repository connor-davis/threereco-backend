import { customType } from "drizzle-orm/pg-core";

export const decimalNumber = customType<{ data: number }>({
  dataType() {
    return "decimal";
  },
  fromDriver(value) {
    return Number(value);
  },
});

export const decimalInt = customType<{ data: number }>({
  dataType() {
    return "bigint";
  },
  fromDriver(value) {
    return Number(value);
  },
});
