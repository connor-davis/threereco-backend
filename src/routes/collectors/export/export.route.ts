import { createRoute, z } from "@hono/zod-openapi";

import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import authenticationMiddleware from "@/middleware/authentication-middleware";

export const exportCollectorsRoute = createRoute({
  path: "/collectors/export",
  method: "get",
  tags: TAGS.COLLECTORS,
  responses: {
    [HttpStatus.OK]: {
      content: {
        "text/plain": {
          schema: z.string().default("csv"),
        },
      },
      description: "The csv response text.",
    },
    [HttpStatus.INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema("Failed to generate collectors export."),
      "The internal server error message."
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
      ["system_admin", "admin", "staff"],
      context,
      next
    ),
});

export type ExportCollectorsRoute = typeof exportCollectorsRoute;
