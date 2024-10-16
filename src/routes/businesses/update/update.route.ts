import { createRoute, z } from "@hono/zod-openapi";

import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import authenticationMiddleware from "@/middleware/authentication-middleware";
import {
  insertBusinessesSchema,
  selectBusinessesSchema,
} from "@/schemas/business";

const updateBusinessRoute = createRoute({
  path: "/businesses",
  method: "put",
  tags: TAGS.BUSINESSES,
  request: {
    query: z.object({
      id: z.string().uuid(),
    }),
    body: jsonContent(
      insertBusinessesSchema,
      "The business object for the updated business."
    ),
  },
  responses: {
    [HttpStatus.OK]: jsonContent(
      selectBusinessesSchema,
      "The business object for the updated business."
    ),
    [HttpStatus.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("The business was not found."),
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

export type UpdateBusinessRoute = typeof updateBusinessRoute;

export default updateBusinessRoute;
