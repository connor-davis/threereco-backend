import { createRoute } from "@hono/zod-openapi";

import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import authenticationMiddleware from "@/middleware/authentication-middleware";
import { createUsersSchema, selectUsersSchema } from "@/schemas/user";

const createUserRoute = createRoute({
  path: "/users",
  method: "post",
  tags: TAGS.USERS,
  request: {
    body: jsonContentRequired(
      createUsersSchema,
      "The new user object payload."
    ),
  },
  responses: {
    [HttpStatus.OK]: jsonContent(
      selectUsersSchema,
      "The user object of the new user."
    ),
    [HttpStatus.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Please provide a role for the user."),
      "The bad request error message."
    ),
    [HttpStatus.CONFLICT]: jsonContent(
      createMessageObjectSchema("The user already exists."),
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

export type CreateUserRoute = typeof createUserRoute;

export default createUserRoute;
