import { createRoute } from "@hono/zod-openapi";

import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import authenticationMiddleware from "@/middleware/authentication-middleware";
import {
  insertBusinessesSchema,
  selectBusinessesSchema,
} from "@/schemas/business";

const createBusinessRoute = createRoute({
  path: "/businesses",
  method: "post",
  tags: TAGS.BUSINESSES,
  request: {
    body: jsonContentRequired(
      insertBusinessesSchema,
      "The business object of the new business."
    ),
  },
  responses: {
    [HttpStatus.OK]: jsonContent(
      selectBusinessesSchema,
      "The business object of the new business."
    ),
    [HttpStatus.CONFLICT]: jsonContent(
      createMessageObjectSchema(
        "There is already a business with that business name."
      ),
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
      ["system_admin", "admin", "staff"],
      context,
      next
    ),
});

export type CreateBusinessRoute = typeof createBusinessRoute;

export default createBusinessRoute;
