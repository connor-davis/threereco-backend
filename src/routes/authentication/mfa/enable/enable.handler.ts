import { eq } from "drizzle-orm";
import { TimeSpan } from "oslo";
import { HMAC } from "oslo/crypto";
import { decodeHex, encodeHex } from "oslo/encoding";
import { createTOTPKeyURI } from "oslo/otp";

import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import users from "@/schemas/user";

import { EnableRoute } from "./enable.route";

const enableHandler: KalimbuRoute<EnableRoute> = async (context) => {
  const session = context.var.session;
  const userId = session.get("user_id") as string;

  const user = await database.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });

  if (!user)
    return context.json(
      { message: "The user was not found." },
      HttpStatus.NOT_FOUND
    );

  const secret = user.mfaSecret
    ? decodeHex(user.mfaSecret)
    : await new HMAC("SHA-1").generateKey();

  const issuer = "3rEco";
  const accountName = user.email;

  if (!user.mfaSecret)
    await database
      .update(users)
      .set({ mfaSecret: encodeHex(secret) })
      .where(eq(users.id, userId));

  const uri = createTOTPKeyURI(issuer, accountName, secret, {
    digits: 6,
    period: new TimeSpan(30, "s"),
  });

  return context.text(uri, HttpStatus.OK);
};

export default enableHandler;
