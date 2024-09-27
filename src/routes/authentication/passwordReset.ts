import "dotenv/config";

import { zValidator } from "@hono/zod-validator";
import { genSalt, hash } from "bcrypt";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import type { Session } from "hono-sessions";
import { decodeHex } from "oslo/encoding";
import { TOTPController } from "oslo/otp";
import { z } from "zod";
import db from "../../db";
import { users } from "../../schemas";
import authMiddleware from "../../utilities/authMiddleware";

const passwordResetRouter = new Hono<{
  Variables: {
    session: Session;
    session_key_rotation: boolean;
  };
}>();

const QuerySchema = z.object({
  code: z.string(),
  password: z.string(),
  userId: z.string().uuid(),
});

const totpController = new TOTPController();

passwordResetRouter.post(
  "/",
  async (context, next) =>
    await authMiddleware(["System Admin", "Admin"], context, next),
  zValidator("json", QuerySchema),
  async (context) => {
    const { code, password, userId } = await QuerySchema.parseAsync(
      await context.req.json()
    );

    const session = context.get("session");
    const sessionUserId = session.get("user_id") as string;

    const results = await db
      .select()
      .from(users)
      .where(eq(users.id, sessionUserId))
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
    const otpVerified = await totpController.verify(code, secret);

    if (!otpVerified)
      return context.json(
        {
          error: "Unauthorized",
          reason: "Invalid MFA code. Please try again.",
        },
        401
      );

    const passwordSalt = await genSalt(2048);
    const hashedPassword = await hash(password, passwordSalt);

    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));

    return context.text("ok", 200);
  }
);

export default passwordResetRouter;
