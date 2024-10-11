import { createRoute, z } from "@hono/zod-openapi";

import createRouter from "@/lib/create-router";
import TAGS from "@/lib/tags";

const CharosText = `██╗  ██╗ █████╗ ██╗     ██╗███╗   ███╗██████╗ ██╗   ██╗    ████████╗███████╗ ██████╗██╗  ██╗
██║ ██╔╝██╔══██╗██║     ██║████╗ ████║██╔══██╗██║   ██║    ╚══██╔══╝██╔════╝██╔════╝██║  ██║
█████╔╝ ███████║██║     ██║██╔████╔██║██████╔╝██║   ██║       ██║   █████╗  ██║     ███████║
██╔═██╗ ██╔══██║██║     ██║██║╚██╔╝██║██╔══██╗██║   ██║       ██║   ██╔══╝  ██║     ██╔══██║
██║  ██╗██║  ██║███████╗██║██║ ╚═╝ ██║██████╔╝╚██████╔╝       ██║   ███████╗╚██████╗██║  ██║
╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝╚═╝     ╚═╝╚═════╝  ╚═════╝        ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝
`;

const index = createRouter().openapi(
  createRoute({
    method: "get",
    path: "/",
    tags: TAGS.INDEX,
    responses: {
      200: {
        content: {
          "text/plain": {
            schema: z.string().default("Charos API index route."),
          },
        },
        description: "Charos API index route.",
      },
    },
  }),
  (context) => {
    return context.text(CharosText, 200);
  }
);

export default index;
