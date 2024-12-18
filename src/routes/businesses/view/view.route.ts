import { createRoute, z } from "@hono/zod-openapi";

import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import authenticationMiddleware from "@/middleware/authentication-middleware";
import { selectBusinessesSchema } from "@/schemas/business";

export const viewBusinessesRoute = createRoute({
  path: "/businesses",
  method: "get",
  tags: TAGS.BUSINESSES,
  request: {
    query: z.object({
      includeUser: z
        .enum(["true", "false", "1", "0"])
        .default("false")
        .transform((value) => value === "true" || value === "1"),
      page: z.coerce.number().default(1),
      count: z.coerce.number().default(10),
      usePaging: z
        .enum(["true", "false", "1", "0"])
        .default("true")
        .transform((value) => value === "true" || value === "1"),
    }),
  },
  responses: {
    [HttpStatus.OK]: jsonContent(
      z.array(selectBusinessesSchema),
      "The business object/s."
    ),
    [HttpStatus.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("The business was not found."),
      "The not-found error message."
    ),
    [HttpStatus.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema(
        "You are not authorized to access this endpoint."
      ),
      "The un-authorized error message."
    ),
  },
  middleware: async (context, next) =>
    await authenticationMiddleware(
      ["system_admin", "admin", "staff", "business"],
      context,
      next
    ),
});

export type ViewBusinessesRoute = typeof viewBusinessesRoute;

export const viewBusinessRoute = createRoute({
  path: "/businesses/{id}",
  method: "get",
  tags: TAGS.BUSINESSES,
  request: {
    query: z.object({
      includeUser: z
        .enum(["true", "false", "1", "0"])
        .default("false")
        .transform((value) => value === "true" || value === "1"),
    }),
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    [HttpStatus.OK]: jsonContent(
      selectBusinessesSchema,
      "The business object/s."
    ),
    [HttpStatus.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("The business was not found."),
      "The not-found error message."
    ),
    [HttpStatus.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema(
        "You are not authorized to access this endpoint."
      ),
      "The un-authorized error message."
    ),
  },
  middleware: async (context, next) =>
    await authenticationMiddleware(
      ["system_admin", "admin", "staff", "business"],
      context,
      next
    ),
});

export type ViewBusinessRoute = typeof viewBusinessRoute;
