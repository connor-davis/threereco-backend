import { Hono } from "hono";
import type { LoginModel } from "../../models/login";
import type { Session } from "hono-sessions";
import { compareSync } from "bcrypt";
import db from "../../db";
import { eq } from "drizzle-orm";
import { userSchema } from "../../models/user";
import { users } from "../../schemas";

const loginRouter = new Hono<{
  Variables: {
    session: Session;
    session_key_rotation: boolean;
  };
}>();

loginRouter.post("/", async (context) => {
  const { email, password } = await context.req.json<LoginModel>();

  if (email && password) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const userFound = result[0];

    if (!userFound) {
      return context.json(
        {
          error: "Not Found",
          reason: "User not found.",
        },
        404
      );
    }

    if (!compareSync(password, userFound.password)) {
      return context.json(
        {
          error: "Unauthorized",
          reason: "Passwords do not match.",
        },
        401
      );
    }

    if (!userFound.active) {
      return context.json(
        {
          error: "Unauthorized",
          reason: "User has been deactivated.",
        },
        401
      );
    }

    const session = context.get("session");

    session.set("user_id", userFound.id);
    session.set("user_email", userFound.email);

    return context.json({ data: userSchema.parse(userFound) }, 200);
  } else {
    return context.json(
      {
        error: "Bad Request",
        reason: "Please provide a username and a password.",
      },
      400
    );
  }
});

export default loginRouter;
