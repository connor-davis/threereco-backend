import { createRoute, z } from "@hono/zod-openapi";

import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import authenticationMiddleware from "@/middleware/authentication-middleware";

const productsPagingRoute = createRoute({
  path: "/products/paging",
  method: "get",
  tags: TAGS.PRODUCTS,
  request: {
    query: z.object({
      count: z.coerce.number().default(10),
    }),
  },
  responses: {
    [HttpStatus.OK]: jsonContent(
      z.object({
        totalProducts: z.coerce.number(),
        totalPages: z.coerce.number(),
      }),
      "The products paging object."
    ),
    [HttpStatus.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema(
        "You are not authorized to access this endpoint."
      ),
      "The un-authorized error message."
    ),
  },
  middleware: async (context, next) =>
    await authenticationMiddleware(undefined, context, next),
});

export type ProductsPagingRoute = typeof productsPagingRoute;

export default productsPagingRoute;
