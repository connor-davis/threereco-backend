import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";

import { LogoutRoute } from "./logout.route";

const logoutHandler: KalimbuRoute<LogoutRoute> = (context) => {
  const session = context.var.session;

  session.deleteSession();

  return context.text("ok", HttpStatus.OK);
};

export default logoutHandler;
