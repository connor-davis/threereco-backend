import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import { registerUsersSchema, selectUsersSchema } from "@/schemas/user";
import { createRoute } from "@hono/zod-openapi";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

const registerRoute = createRoute({
  path: "/authentication/register",
  method: "post",
  tags: TAGS.AUTHENTICATION,
  request: {
    body: jsonContent(
      registerUsersSchema,
      "The user object of the user being registered."
    ),
  },
  responses: {
    [HttpStatus.OK]: jsonContent(
      selectUsersSchema,
      "The user object of the successfully registered user."
    ),
    [HttpStatus.CONFLICT]: jsonContent(
      createMessageObjectSchema("The user already exists."),
      "The conflict error message."
    ),
  },
});

export type RegisterRoute = typeof registerRoute;

export default registerRoute;
