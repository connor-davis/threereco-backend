import { createRoute, z } from "@hono/zod-openapi";

import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import authenticationMiddleware from "@/middleware/authentication-middleware";
import { selectUsersSchema } from "@/schemas/user";

export const viewUsersRoute = createRoute({
  path: "/users",
  method: "get",
  tags: TAGS.USERS,
  request: {
    query: z.object({
      page: z.coerce.number().default(1),
      count: z.coerce.number().default(10),
      role: z
        .enum(["system_admin", "admin", "staff", "business", "collector"])
        .optional()
        .nullable(),
    }),
  },
  responses: {
    [HttpStatus.OK]: jsonContent(
      z.array(selectUsersSchema),
      "The user object/s."
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
    await authenticationMiddleware(undefined, context, next),
});

export type ViewUsersRoute = typeof viewUsersRoute;

export const viewUserRoute = createRoute({
  path: "/users/{id}",
  method: "get",
  tags: TAGS.USERS,
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    [HttpStatus.OK]: jsonContent(selectUsersSchema, "The user object/s."),
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
    await authenticationMiddleware(undefined, context, next),
});

export type ViewUserRoute = typeof viewUserRoute;
