import { OpenAPIHono } from "@hono/zod-openapi";

import { KalimbuConfig } from "@/lib/types";

import packageJSON from "../../package.json";

export default function configureOpenAPI(app: OpenAPIHono<KalimbuConfig>) {
  app.doc("/api/api-spec", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "3rEco API",
    },
  });
}
