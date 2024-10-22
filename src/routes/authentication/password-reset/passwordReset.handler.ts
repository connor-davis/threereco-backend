import { genSalt, hash } from "bcrypt";
import { eq } from "drizzle-orm";
import { decodeHex } from "oslo/encoding";
import { TOTPController } from "oslo/otp";

import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import users from "@/schemas/user";

import { PasswordResetRoute } from "./passwordReset.route";

const totpController = new TOTPController();

const passwordResetHandler: KalimbuRoute<PasswordResetRoute> = async (
  context
) => {
  const session = context.var.session;
  const userId = session.get("user_id") as string;

  const payload = context.req.valid("json");

  const user = await database.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });

  const mfaSecret = user!.mfaSecret!;

  const secret = decodeHex(mfaSecret);
  const otpVerified = await totpController.verify(payload.code, secret);

  if (!otpVerified)
    return context.json(
      { message: "MFA verification failure." },
      HttpStatus.NOT_ACCEPTABLE
    );

  const resetUser = await database.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, payload.userId),
  });

  if (!resetUser)
    return context.json(
      { message: "The user was not found." },
      HttpStatus.NOT_FOUND
    );

  const passwordSalt = await genSalt(2048);
  const passwordHash = await hash(payload.password, passwordSalt);

  await database
    .update(users)
    .set({ password: passwordHash, mfaVerified: false })
    .where(eq(users.id, payload.userId));

  return context.text("ok", HttpStatus.OK);
};

export default passwordResetHandler;
