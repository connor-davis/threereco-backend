import { createRoute, z } from "@hono/zod-openapi";

import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import authenticationMiddleware from "@/middleware/authentication-middleware";
import {
  insertCollectorsSchema,
  selectCollectorsSchema,
} from "@/schemas/collector";

const updateCollectorRoute = createRoute({
  path: "/collectors",
  method: "put",
  tags: TAGS.COLLECTORS,
  request: {
    query: z.object({
      id: z.string().uuid(),
    }),
    body: jsonContent(
      insertCollectorsSchema,
      "The collector object for the updated collector."
    ),
  },
  responses: {
    [HttpStatus.OK]: jsonContent(
      selectCollectorsSchema,
      "The collector object for the updated collector."
    ),
    [HttpStatus.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("The collector was not found."),
      "The not-found error message."
    ),
    [HttpStatus.CONFLICT]: jsonContent(
      z.union([
        createMessageObjectSchema(
          "There is already a collector with that ID number."
        ),
        createMessageObjectSchema(
          "There is already a collector with that account number."
        ),
      ]),
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

export type UpdateCollectorRoute = typeof updateCollectorRoute;

export default updateCollectorRoute;
