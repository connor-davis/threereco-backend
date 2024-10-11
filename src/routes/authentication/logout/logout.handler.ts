import HttpStatus from "@/lib/http-status";
import { KalimbuHandler } from "@/lib/types";
import { LogoutRoute } from "./logout.route";

const logoutHandler: KalimbuHandler<LogoutRoute> = (context) => {
  const session = context.var.session;

  session.deleteSession();

  return context.text("ok", HttpStatus.OK);
};

export default logoutHandler;
