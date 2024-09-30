import { genSalt, hash } from "bcrypt";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import type { Session } from "hono-sessions";
import db from "../../db";
import type { RegisterModel } from "../../models/login";
import { userSchema } from "../../models/user";
import { users } from "../../schemas";

const registerRouter = new Hono<{
  Variables: {
    session: Session;
    session_key_rotation: boolean;
  };
}>();

registerRouter.post("/", async (context) => {
  const { email, password, role } = await context.req.json<RegisterModel>();

  if (email && password) {
    let result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    let userFound = result[0];

    if (userFound) {
      return context.json(
        {
          error: "Bad Request",
          reason:
            "A user with that email already exists. Please enter a different email.",
        },
        400
      );
    }

    const hashSalt = await genSalt(2048);
    const hashedPassword = await hash(password, hashSalt);

    const newUser = await db
      .insert(users)
      .values({ email, password: hashedPassword, role: role ?? "Collector" })
      .returning({ id: users.id, email: users.email, role: users.role });

    const session = context.get("session");

    session.set("user_id", newUser[0].id);
    session.set("user_email", newUser[0].email);
    session.set("user_role", newUser[0].role);

    return context.json({ ...userSchema.parse(newUser[0]) }, 200);
  } else {
    return context.json(
      {
        error: "Bad Request",
        reason: "Please provide an email and a password.",
      },
      400
    );
  }
});

export default registerRouter;
