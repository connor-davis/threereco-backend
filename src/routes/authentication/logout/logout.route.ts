import HttpStatus from "@/lib/http-status";
import TAGS from "@/lib/tags";
import { createRoute, z } from "@hono/zod-openapi";

const logoutRoute = createRoute({
  path: "/authentication/logout",
  method: "post",
  tags: TAGS.AUTHENTICATION,
  responses: {
    [HttpStatus.OK]: {
      content: {
        "text/plain": {
          schema: z.string().default("The ok response text."),
        },
      },
      description: "The ok response text.",
    },
  },
});

export type LogoutRoute = typeof logoutRoute;

export default logoutRoute;
