import { OpenAPIHono } from "@hono/zod-openapi";

import { apiReference } from "@scalar/hono-api-reference";

import { KalimbuConfig } from "@/lib/types";

export default function configureScalar(app: OpenAPIHono<KalimbuConfig>) {
  app.get(
    "/api/api-doc",
    apiReference({
      spec: {
        url: "/api/api-spec",
      },
      layout: "classic",
      defaultHttpClient: {
        targetKey: "node",
        clientKey: "fetch",
      },
    })
  );
}
