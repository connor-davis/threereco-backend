import { Hono } from "hono";
import createBusinessRouter from "./create";
import updateBusinessRouter from "./update";
import deleteBusinessRouter from "./delete";
import viewBusinessesRouter from "./view";

const businessesRouter = new Hono();

businessesRouter.route("/", createBusinessRouter);
businessesRouter.route("/", updateBusinessRouter);
businessesRouter.route("/", deleteBusinessRouter);
businessesRouter.route("/", viewBusinessesRouter);

export default businessesRouter;
