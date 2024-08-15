import "dotenv/config";

import { Hono } from "hono";
import type { Session } from "hono-sessions";
import authMiddleware from "../../utilities/authMiddleware";
import { authenticator } from "otplib";
import db from "../../db";
import { eq } from "drizzle-orm";
import { users } from "../../schemas";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const mfaRouter = new Hono<{
  Variables: {
    session: Session;
    session_key_rotation: boolean;
  };
}>();

mfaRouter.post(
  "/generate",
  async (context, next) => await authMiddleware(undefined, context, next),
  async (context) => {
    const secret = authenticator.generateSecret();
    const session = context.get("session");

    const userId = session.get("user_id") as string;

    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    const userFound = result[0];

    if (!userFound) {
      return context.json(
        {
          error: "Unauthorized",
          reason: "You are not authorized to access this endpoint.",
        },
        401
      );
    }

    const service = process.env.MFA_ISSUER ?? "THUSA";

    const otpAuthentication = authenticator.keyuri(
      userFound.email,
      service,
      secret
    );

    await db
      .update(users)
      .set({ mfaSecret: secret })
      .where(eq(users.id, userId));

    return context.text(otpAuthentication, 200);
  }
);

mfaRouter.post(
  "/verify",
  async (context, next) => await authMiddleware(undefined, context, next),
  zValidator("json", z.object({ token: z.string() })),
  async (context) => {
    const { token } = await context.req.json();
    const session = context.get("session");

    const userId = session.get("user_id") as string;

    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    const userFound = result[0];

    if (!userFound) {
      return context.json(
        {
          error: "Unauthorized",
          reason: "You are not authorized to access this endpoint.",
        },
        401
      );
    }

    const secret = userFound.mfaSecret;

    if (!secret) {
      return context.json(
        {
          error: "Unauthorized",
          reason: "User has not setup MFA authentication.",
        },
        401
      );
    }

    const isValid = authenticator.check(token, secret);

    if (!isValid) {
      return context.json(
        {
          error: "Unauthorized",
          reason: "MFA authentication failed.",
        },
        401
      );
    }

    await db
      .update(users)
      .set({ mfaEnabled: true, mfaVerified: true })
      .where(eq(users.id, userId));

    return context.text("ok", 200);
  }
);

export default mfaRouter;
