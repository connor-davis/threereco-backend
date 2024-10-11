import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuHandler } from "@/lib/types";
import { decodeHex } from "oslo/encoding";
import { TOTPController } from "oslo/otp";
import { VerifyRoute } from "./verify.route";

const totpController = new TOTPController();

const verifyHandler: KalimbuHandler<VerifyRoute> = async (context) => {
  const session = context.var.session;
  const userId = session.get("user_id") as string;

  const payload = context.req.valid("json");

  const user = await database.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });

  if (!user)
    return context.json(
      { message: "The user was not found." },
      HttpStatus.NOT_FOUND
    );

  const mfaSecret = user.mfaSecret;

  if (!mfaSecret)
    return context.json(
      { message: "MFA has not yet been enabled for this account." },
      HttpStatus.NOT_ACCEPTABLE
    );

  const secret = decodeHex(mfaSecret);
  const otpVerified = await totpController.verify(payload.code, secret);

  if (!otpVerified)
    return context.json(
      { message: "MFA verification failure." },
      HttpStatus.NOT_ACCEPTABLE
    );

  return context.text("ok", HttpStatus.OK);
};

export default verifyHandler;
