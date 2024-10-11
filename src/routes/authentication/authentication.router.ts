import createRouter from "@/lib/create-router";
import checkRoute from "@/routes/authentication/check/check.route";
import loginHandler from "@/routes/authentication/login/login.handler";
import loginRoute from "@/routes/authentication/login/login.route";
import checkHandler from "./check/check.handler";
import logoutHandler from "./logout/logout.handler";
import logoutRoute from "./logout/logout.route";
import enableHandler from "./mfa/enable/enable.handler";
import enableRoute from "./mfa/enable/enable.route";
import verifyHandler from "./mfa/verify/verify.handler";
import verifyRoute from "./mfa/verify/verify.route";
import registerHandler from "./register/register.handler";
import registerRoute from "./register/register.route";

const authentication = createRouter()
  .openapi(loginRoute, loginHandler)
  .openapi(logoutRoute, logoutHandler)
  .openapi(registerRoute, registerHandler)
  .openapi(checkRoute, checkHandler)
  .openapi(enableRoute, enableHandler)
  .openapi(verifyRoute, verifyHandler);

export default authentication;
