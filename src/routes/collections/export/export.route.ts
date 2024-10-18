import { createRoute, z } from "@hono/zod-openapi";

import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import authenticationMiddleware from "@/middleware/authentication-middleware";

const exportCollectionsRoute = createRoute({
  path: "/collections/export",
  method: "get",
  tags: TAGS.COLLECTIONS,
  request: {
    query: z.object({
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
    }),
  },
  responses: {
    [HttpStatus.OK]: {
      content: {
        "text/plain": {
          schema: z.string().default("csv"),
        },
      },
      description: "The csv response text.",
    },
    [HttpStatus.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema(
        "You are not authorized to access this endpoint."
      ),
      "The un-authorized error message."
    ),
  },
  middleware: async (context, next) =>
    await authenticationMiddleware(
      ["system_admin", "admin", "business"],
      context,
      next
    ),
});

export type ExportCollectionsRoute = typeof exportCollectionsRoute;

export default exportCollectionsRoute;
