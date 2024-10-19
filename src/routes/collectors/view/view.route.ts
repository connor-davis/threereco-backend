import { createRoute, z } from "@hono/zod-openapi";

import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import authenticationMiddleware from "@/middleware/authentication-middleware";
import { selectCollectorsSchema } from "@/schemas/collector";

const viewCollectorsRoute = createRoute({
  path: "/collectors",
  method: "get",
  tags: TAGS.COLLECTORS,
  request: {
    query: z.object({
      id: z.string().uuid().optional().nullable(),
      includeUser: z
        .enum(["true", "false", "1", "0"])
        .default("false")
        .transform((value) => value === "true" || value === "1"),
      page: z.coerce.number().default(1),
      count: z.coerce.number().default(10),
    }),
  },
  responses: {
    [HttpStatus.OK]: jsonContent(
      z.union([selectCollectorsSchema, z.array(selectCollectorsSchema)]),
      "The collector object/s."
    ),
    [HttpStatus.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("The collector was not found."),
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

export type ViewCollectorsRoute = typeof viewCollectorsRoute;

export default viewCollectorsRoute;
