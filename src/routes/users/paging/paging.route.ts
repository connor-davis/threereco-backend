import { createRoute, z } from "@hono/zod-openapi";

import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import authenticationMiddleware from "@/middleware/authentication-middleware";

const usersPagingRoute = createRoute({
  path: "/users/paging",
  method: "get",
  tags: TAGS.USERS,
  request: {
    query: z.object({
      count: z.coerce.number().default(10),
    }),
  },
  responses: {
    [HttpStatus.OK]: jsonContent(
      z.object({
        totalUsers: z.coerce.number(),
        totalPages: z.coerce.number(),
      }),
      "The users paging object."
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

export type UsersPagingRoute = typeof usersPagingRoute;

export default usersPagingRoute;
