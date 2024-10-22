import { createRoute } from "@hono/zod-openapi";

import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import authenticationMiddleware from "@/middleware/authentication-middleware";
import { insertProductsSchema, selectProductsSchema } from "@/schemas/products";

const createProductRoute = createRoute({
  path: "/products",
  method: "post",
  tags: TAGS.PRODUCTS,
  request: {
    body: jsonContentRequired(
      insertProductsSchema,
      "The product object of the new product."
    ),
  },
  responses: {
    [HttpStatus.OK]: jsonContent(
      selectProductsSchema,
      "The product object of the new product."
    ),
    [HttpStatus.CONFLICT]: jsonContent(
      createMessageObjectSchema("There is already a product with that name."),
      "The conflict error message."
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

export type CreateProductRoute = typeof createProductRoute;

export default createProductRoute;
