import { createRoute, z } from "@hono/zod-openapi";

import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import authenticationMiddleware from "@/middleware/authentication-middleware";

const deleteAccountRoute = createRoute({
  path: "/users/delete-account",
  method: "post",
  tags: TAGS.USERS,
  request: {
    body: jsonContentRequired(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
      "The delete user object for the deleted user."
    ),
  },
  responses: {
    [HttpStatus.OK]: {
      content: {
        "text/plain": {
          schema: z.string().default("ok"),
        },
      },
      description: "The ok response text",
    },
    [HttpStatus.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("The user was not found."),
      "The not-found error message."
    ),
    [HttpStatus.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema(
        "You are not authorized to access this endpoint."
      ),
      "The un-authorized error message"
    ),
  },
  middleware: async (context, next) =>
    await authenticationMiddleware(undefined, context, next),
});

export type DeleteAccountRoute = typeof deleteAccountRoute;

export default deleteAccountRoute;
