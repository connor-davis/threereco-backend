import { OpenAPIHono } from "@hono/zod-openapi";

import { KalimbuConfig } from "@/lib/types";

export default function createRouter() {
  return new OpenAPIHono<KalimbuConfig>({ strict: false });
}
