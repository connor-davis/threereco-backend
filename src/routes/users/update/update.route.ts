import { createRoute, z } from "@hono/zod-openapi";

import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import authenticationMiddleware from "@/middleware/authentication-middleware";
import { selectUsersSchema, updateUsersSchema } from "@/schemas/user";

const updateUserRoute = createRoute({
  path: "/users/{id}",
  method: "put",
  tags: TAGS.USERS,
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
    body: jsonContent(updateUsersSchema, "The updated user object."),
  },
  responses: {
    [HttpStatus.OK]: jsonContent(
      selectUsersSchema,
      "The user object of the updated user."
    ),
    [HttpStatus.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("The user was not found."),
      "The not-found error message."
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

export type UpdateUserRoute = typeof updateUserRoute;

export default updateUserRoute;
