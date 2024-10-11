import { Context, Next } from "hono";

const rateLimiterMiddleware = async (context: Context, next: Next) => {
  next();
};

export default rateLimiterMiddleware;
