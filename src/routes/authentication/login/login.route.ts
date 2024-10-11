import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import { loginUsersSchema, selectUsersSchema } from "@/schemas/user";
import { createRoute } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

const loginRoute = createRoute({
  path: "/authentication/login",
  method: "post",
  tags: TAGS.AUTHENTICATION,
  request: {
    body: jsonContentRequired(
      loginUsersSchema,
      "The login payload needed to log a user in."
    ),
  },
  responses: {
    [HttpStatus.OK]: jsonContent(
      selectUsersSchema,
      "The user object returned for a successfully logged in user."
    ),
    [HttpStatus.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("The user was not found."),
      "The not-found response message."
    ),
    [HttpStatus.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Invalid password."),
      "The un-authorized response message."
    ),
  },
});

export type LoginRoute = typeof loginRoute;

export default loginRoute;
