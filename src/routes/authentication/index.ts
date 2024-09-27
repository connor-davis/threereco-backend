import { Hono } from "hono";
import checkRouter from "./check";
import loginRouter from "./login";
import logoutRouter from "./logout";
import mfaRouter from "./mfa";
import passwordResetRouter from "./passwordReset";

const authenticationRouter = new Hono();

authenticationRouter.route("/login", loginRouter);
authenticationRouter.route("/logout", logoutRouter);
authenticationRouter.route("/mfa", mfaRouter);
authenticationRouter.route("/check", checkRouter);
authenticationRouter.route("/password-reset", passwordResetRouter);

export default authenticationRouter;
