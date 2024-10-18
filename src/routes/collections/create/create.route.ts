import { createRoute } from "@hono/zod-openapi";

import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import authenticationMiddleware from "@/middleware/authentication-middleware";
import {
  insertCollectionsSchema,
  selectCollectionsSchema,
} from "@/schemas/collection";

const createCollectionRoute = createRoute({
  path: "/collections",
  method: "post",
  tags: TAGS.COLLECTIONS,
  request: {
    body: jsonContentRequired(
      insertCollectionsSchema,
      "The collection object of the new collection."
    ),
  },
  responses: {
    [HttpStatus.OK]: jsonContent(
      selectCollectionsSchema,
      "The collection object of the new collection."
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

export type CreateCollectionRoute = typeof createCollectionRoute;

export default createCollectionRoute;
