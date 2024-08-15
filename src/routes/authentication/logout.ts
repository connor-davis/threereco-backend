import { Hono } from "hono";
import type { Session } from "hono-sessions";
import authMiddleware from "../../utilities/authMiddleware";

const logoutRouter = new Hono<{
  Variables: {
    session: Session;
    session_key_rotation: boolean;
  };
}>();

logoutRouter.post(
  "/",
  async (context, next) => await authMiddleware(undefined, context, next),
  async (context) => {
    const session = context.get("session");

    session.deleteSession();

    return context.text("ok", 200);
  }
);

export default logoutRouter;
