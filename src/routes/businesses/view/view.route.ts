import { createRoute, z } from "@hono/zod-openapi";

import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import { selectBusinessesSchema } from "@/schemas/business";

const viewBusinessesRoute = createRoute({
  path: "/businesses",
  method: "get",
  tags: TAGS.BUSINESSES,
  request: {
    query: z.object({
      id: z.string().uuid().optional().nullable(),
    }),
  },
  responses: {
    [HttpStatus.OK]: jsonContent(
      z.union([selectBusinessesSchema, z.array(selectBusinessesSchema)]),
      "The business object/s."
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
});

export type ViewBusinessesRoute = typeof viewBusinessesRoute;

export default viewBusinessesRoute;
