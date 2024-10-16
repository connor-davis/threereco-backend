import { RouteConfig, RouteHandler } from "@hono/zod-openapi";
import { MiddlewareHandler } from "hono";
import { PinoLogger } from "hono-pino";
import { Session } from "hono-sessions";

import { customType } from "drizzle-orm/pg-core";

export type KalimbuConfig = {
  Variables: {
    logger: PinoLogger;
    session: Session;
    session_key_rotation: boolean;
  };
};

export type KalimbuRoute<R extends RouteConfig> = RouteHandler<
  R,
  KalimbuConfig
>;

export type KalimbuMiddleware = MiddlewareHandler<KalimbuConfig>;

export const decimalNumber = customType<{ data: number }>({
  dataType() {
    return "decimal";
  },
  fromDriver(value) {
    return Number(value);
  },
});

export const decimalInt = customType<{ data: number }>({
  dataType() {
    return "bigint";
  },
  fromDriver(value) {
    return Number(value);
  },
});
