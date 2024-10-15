import { createRoute, z } from "@hono/zod-openapi";

import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import authenticationMiddleware from "@/middleware/authentication-middleware";
import { selectUsersSchema } from "@/schemas/user";

const listUsersRoute = createRoute({
  path: "/users",
  method: "get",
  tags: TAGS.USERS,
  responses: {
    [HttpStatus.OK]: jsonContent(z.array(selectUsersSchema), "The users list."),
    [HttpStatus.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema(
        "You are not authorized to access this endpoint."
      ),
      "The un-authorized error message."
    ),
  },
  middleware: async (context, next) =>
    await authenticationMiddleware(
      ["system_admin", "admin", "staff"],
      context,
      next
    ),
});

export type ListUsersRoute = typeof listUsersRoute;

export default listUsersRoute;
