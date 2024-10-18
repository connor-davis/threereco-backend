import { z } from "@hono/zod-openapi";

(BigInt.prototype as any).toJSON = function () {
  return Number.parseInt(this.toString());
};

export const booleanQueryParameter = z
  .enum(["true", "false", "1", "0"])
  .default("false")
  .transform((value) => value === "true" || value === "1");
