import { createRoute, z } from "@hono/zod-openapi";

import { booleanQueryParameter } from "patches";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import authenticationMiddleware from "@/middleware/authentication-middleware";
import { selectCollectionsSchema } from "@/schemas/collection";

const viewCollectionsRoute = createRoute({
  path: "/collections",
  method: "get",
  tags: TAGS.COLLECTIONS,
  request: {
    query: z.object({
      id: z.string().uuid().optional().nullable(),
      includeBusiness: booleanQueryParameter,
      includeBusinessUser: booleanQueryParameter,
      includeCollector: booleanQueryParameter,
      includeCollectorUser: booleanQueryParameter,
      includeProduct: booleanQueryParameter,
      includeProductBusiness: booleanQueryParameter,
      includeProductBusinessUser: booleanQueryParameter,
      page: z.coerce.number().default(1),
      count: z.coerce.number().default(10),
    }),
  },
  responses: {
    [HttpStatus.OK]: jsonContent(
      z.union([selectCollectionsSchema, z.array(selectCollectionsSchema)]),
      "The collection object/s."
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

export type ViewCollectionsRoute = typeof viewCollectionsRoute;

export default viewCollectionsRoute;
