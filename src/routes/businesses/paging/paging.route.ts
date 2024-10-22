import { createRoute, z } from "@hono/zod-openapi";

import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import authenticationMiddleware from "@/middleware/authentication-middleware";

const businessesPagingRoute = createRoute({
  path: "/businesses/paging",
  method: "get",
  tags: TAGS.BUSINESSES,
  request: {
    query: z.object({
      count: z.coerce.number().default(10),
    }),
  },
  responses: {
    [HttpStatus.OK]: jsonContent(
      z.object({
        totalBusinesses: z.coerce.number(),
        totalPages: z.coerce.number(),
      }),
      "The businesses paging object."
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

export type BusinessesPagingRoute = typeof businessesPagingRoute;

export default businessesPagingRoute;
