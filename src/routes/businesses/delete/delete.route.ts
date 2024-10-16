import { createRoute, z } from "@hono/zod-openapi";

import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import authenticationMiddleware from "@/middleware/authentication-middleware";

const deleteBusinessRoute = createRoute({
  path: "/businesses",
  method: "delete",
  tags: TAGS.BUSINESSES,
  request: {
    query: z.object({
      id: z.string().uuid(),
    }),
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

export type DeleteBusinessRoute = typeof deleteBusinessRoute;

export default deleteBusinessRoute;
