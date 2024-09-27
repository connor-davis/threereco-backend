import "dotenv/config";

import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import type { Session } from "hono-sessions";
import { TimeSpan } from "oslo";
import { HMAC } from "oslo/crypto";
import { decodeHex, encodeHex } from "oslo/encoding";
import { createTOTPKeyURI, TOTPController } from "oslo/otp";
import { z } from "zod";
import db from "../../db";
import { users } from "../../schemas";
import authMiddleware from "../../utilities/authMiddleware";

const mfaRouter = new Hono<{
  Variables: {
    session: Session;
    session_key_rotation: boolean;
  };
}>();

const QuerySchema = z.object({
  code: z.string(),
});

const totpController = new TOTPController();

mfaRouter.get(
  "/enable",
  async (context, next) => await authMiddleware(undefined, context, next),

  async (context) => {
    const session = context.get("session");
    const userId = session.get("user_id") as string;

    const results = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    const user = results[0];

    if (!user)
      return context.json(
        { error: "Not Found", reason: "User not found." },
        404
      );

    const issuer = "Kalimbu Software";
    const accountName = user.email;

    if (!user.mfaSecret) {
      const secret = await new HMAC("SHA-1").generateKey();

      await db
        .update(users)
        .set({ mfaEnabled: true, mfaSecret: encodeHex(secret) })
        .where(eq(users.id, userId));

      const uri = createTOTPKeyURI(issuer, accountName, secret, {
        digits: 6,
        period: new TimeSpan(30, "s"),
      });

      return context.text(uri, 200);
    } else {
      const uri = createTOTPKeyURI(
        issuer,
        accountName,
        decodeHex(user.mfaSecret),
        {
          digits: 6,
          period: new TimeSpan(30, "s"),
        }
      );

      return context.text(uri, 200);
    }
  }
);

mfaRouter.post(
  "/verify",
  async (context, next) => await authMiddleware(undefined, context, next),
  zValidator("json", QuerySchema),
  async (context) => {
    const { code } = await QuerySchema.parseAsync(await context.req.json());

    const session = context.get("session");
    const userId = session.get("user_id") as string;

    const results = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    const user = results[0];

    if (!user)
      return context.json(
        { error: "Not Found", reason: "User not found." },
        404
      );

    const mfaSecret = user.mfaSecret;

    if (!mfaSecret)
      return context.json(
        {
          error: "Not Found",
          reason: "MFA has not been enabled for this account.",
        },
        404
      );

    const secret = decodeHex(mfaSecret);
    const otp = await totpController.generate(secret);

    console.log(code, otp);

    const otpVerified = await totpController.verify(code, secret);

    if (!otpVerified)
      return context.json(
        {
          error: "Unauthorized",
          reason: "Invalid MFA code. Please try again.",
        },
        401
      );

    await db
      .update(users)
      .set({ mfaVerified: true })
      .where(eq(users.id, userId));

    return context.text("ok", 200);
  }
);

export default mfaRouter;
