import { createRoute, z } from "@hono/zod-openapi";

import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import authenticationMiddleware from "@/middleware/authentication-middleware";
import {
  insertCollectionsSchema,
  selectCollectionsSchema,
} from "@/schemas/collection";

const updateCollectionRoute = createRoute({
  path: "/collections",
  method: "put",
  tags: TAGS.COLLECTIONS,
  request: {
    query: z.object({
      id: z.string().uuid(),
    }),
    body: jsonContent(
      insertCollectionsSchema,
      "The collection object for the updated collection."
    ),
  },
  responses: {
    [HttpStatus.OK]: jsonContent(
      selectCollectionsSchema,
      "The collection object for the updated collection."
    ),
    [HttpStatus.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("The collection was not found."),
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

export type UpdateCollectionRoute = typeof updateCollectionRoute;

export default updateCollectionRoute;
