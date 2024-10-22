import { createRoute, z } from "@hono/zod-openapi";

import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import authenticationMiddleware from "@/middleware/authentication-middleware";
import { insertProductsSchema, selectProductsSchema } from "@/schemas/products";

const updateProductRoute = createRoute({
  path: "/products/{id}",
  method: "put",
  tags: TAGS.PRODUCTS,
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
    body: jsonContent(
      insertProductsSchema,
      "The product object for the updated product."
    ),
  },
  responses: {
    [HttpStatus.OK]: jsonContent(
      selectProductsSchema,
      "The product object for the updated product."
    ),
    [HttpStatus.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("The product was not found."),
      "The not-found error message."
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

export type UpdateProductRoute = typeof updateProductRoute;

export default updateProductRoute;
