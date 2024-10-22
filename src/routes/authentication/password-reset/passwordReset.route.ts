import { createRoute, z } from "@hono/zod-openapi";

import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import authenticationMiddleware from "@/middleware/authentication-middleware";

const passwordResetRoute = createRoute({
  path: "/authentication/password-reset",
  method: "put",
  tags: TAGS.AUTHENTICATION,
  request: {
    body: jsonContentRequired(
      z.object({
        code: z.string(),
        password: z.string(),
        userId: z.string().uuid(),
      }),
      "The password reset payload."
    ),
  },
  responses: {
    [HttpStatus.OK]: {
      content: {
        "text/plain": {
          schema: z.string().default("ok"),
        },
      },
      description: "The ok response text.",
    },
    [HttpStatus.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("The user was not found."),
      "The not-found response message."
    ),
    [HttpStatus.NOT_ACCEPTABLE]: jsonContent(
      createMessageObjectSchema("MFA verification failure."),
      "The not-acceptable error message."
    ),
    [HttpStatus.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema(
        "You are not authorized to access this endpoint."
      ),
      "The un-authorized error message."
    ),
  },
  middleware: async (context, next) =>
    await authenticationMiddleware(["system_admin", "admin"], context, next),
});

export type PasswordResetRoute = typeof passwordResetRoute;

export default passwordResetRoute;
