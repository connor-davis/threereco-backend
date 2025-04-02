import { CookieStore, sessionMiddleware } from "hono-sessions";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { secureHeaders } from "hono/secure-headers";

import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";

import createRouter from "@/lib/create-router";
import env from "@/lib/env";
import { pinoLogger } from "@/middleware/pino-logger";
import rateLimiterMiddleware from "@/middleware/rate-limiter";

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
      origin: [
        "http://localhost:5173",
        "https://3reco.vps2.lone-wolf.dev",
        "https://3reco.connor-davis.dev",
      ],
    })
  );
  app.use(
    csrf({
      origin: [
        "http://localhost:5173",
        "https://3reco.vps2.lone-wolf.dev",
        "https://3reco.connor-davis.dev",
      ],
    })
  );

  const store = new CookieStore();

  app.use(
    "*",
    sessionMiddleware({
      store,
      encryptionKey: env.SESSION_SECRET,
      expireAfterSeconds: 60 * 30, // 30 Minutes
      cookieOptions: {
        sameSite: "Lax",
        path: "/",
        httpOnly: true,
        secure: env.NODE_ENV === "production" ? true : false,
      },
    })
  );

  app.use(rateLimiterMiddleware);

  return app;
}
