import { createRoute, z } from "@hono/zod-openapi";

import { booleanQueryParameter } from "patches";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import authenticationMiddleware from "@/middleware/authentication-middleware";
import { selectProductsSchema } from "@/schemas/products";

export const viewProductsRoute = createRoute({
  path: "/products",
  method: "get",
  tags: TAGS.PRODUCTS,
  request: {
    query: z.object({
      includeBusiness: booleanQueryParameter,
      includeBusinessUser: booleanQueryParameter,
      page: z.coerce.number().default(1),
      count: z.coerce.number().default(10),
    }),
  },
  responses: {
    [HttpStatus.OK]: jsonContent(
      z.union([selectProductsSchema, z.array(selectProductsSchema)]),
      "The product object/s."
    ),
    [HttpStatus.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("The product was not found."),
      "The not-found error message"
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

export type ViewProductsRoute = typeof viewProductsRoute;

export const viewProductRoute = createRoute({
  path: "/products/{id}",
  method: "get",
  tags: TAGS.PRODUCTS,
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
    query: z.object({
      includeBusiness: booleanQueryParameter,
      includeBusinessUser: booleanQueryParameter,
    }),
  },
  responses: {
    [HttpStatus.OK]: jsonContent(
      z.union([selectProductsSchema, z.array(selectProductsSchema)]),
      "The product object/s."
    ),
    [HttpStatus.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("The product was not found."),
      "The not-found error message"
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

export type ViewProductRoute = typeof viewProductRoute;
