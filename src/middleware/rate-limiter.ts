import { Context, Next } from "hono";

import { KalimbuMiddleware } from "@/lib/types";

const rateLimiterMiddleware: KalimbuMiddleware = async (
  context: Context,
  next: Next
) => {
  await next();
};

export default rateLimiterMiddleware;
