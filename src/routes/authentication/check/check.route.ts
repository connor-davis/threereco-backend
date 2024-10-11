import { createRoute } from "@hono/zod-openapi";

import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import authenticationMiddleware from "@/middleware/authentication-middleware";
import { selectUsersSchema } from "@/schemas/user";

const checkRoute = createRoute({
  path: "/authentication/check",
  method: "get",
  tags: TAGS.AUTHENTICATION,
  responses: {
    [HttpStatus.OK]: jsonContent(
      selectUsersSchema,
      "The user object returned for a successfully logged in user."
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

export type CheckRoute = typeof checkRoute;

export default checkRoute;
