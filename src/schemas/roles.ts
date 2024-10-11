import { pgEnum } from "drizzle-orm/pg-core";

const roles = pgEnum("roles", [
  "system_admin",
  "admin",
  "staff",
  "business",
  "customer",
]);

export const rolesEnumValues = roles.enumValues;

export default roles;
