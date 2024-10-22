import { createRoute, z } from "@hono/zod-openapi";

import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import authenticationMiddleware from "@/middleware/authentication-middleware";

const logoutRoute = createRoute({
  path: "/authentication/logout",
  method: "post",
  tags: TAGS.AUTHENTICATION,
  responses: {
    [HttpStatus.OK]: {
      content: {
        "text/plain": {
          schema: z.string().default("ok"),
        },
      },
      description: "The ok response text.",
    },
    [HttpStatus.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema(
        "You are not authorized to access this endpoint"
      ),
      "The un-authorized error message."
    ),
  },
  middleware: async (context, next) =>
    await authenticationMiddleware(undefined, context, next),
});

export type LogoutRoute = typeof logoutRoute;

export default logoutRoute;
