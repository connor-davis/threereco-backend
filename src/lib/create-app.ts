import createRouter from "@/lib/create-router";

import env from "@/lib/env";

import { pinoLogger } from "@/middleware/pino-logger";

import { CookieStore, sessionMiddleware } from "hono-sessions";

import { cors } from "hono/cors";

import { csrf } from "hono/csrf";

import { secureHeaders } from "hono/secure-headers";

import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";



export default function createApp() {
  const app = createRouter();

  /**
   * Setup our not found and error middleware to return JSON responses.
   */
  app.notFound(notFound);
  app.onError(onError);

  /**
   * Setup our usages.
   */
  app.use(serveEmojiFavicon("📦"));
  app.use(pinoLogger());

  app.use(secureHeaders());
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );
  app.use(csrf());

  const store = new CookieStore();

  app.use(
    "*",
    sessionMiddleware({
      store,
      encryptionKey: env.SESSION_SECRET,
      expireAfterSeconds: 60 * 30, // 30 Minutes
      cookieOptions: {
        sameSite: "Strict",
        path: "/",
        httpOnly: true,
      },
    })
  );

  return app;
}
