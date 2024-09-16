import { Hono } from "hono";
import stockRouter from "./stock";

const analyticsRouter = new Hono();

analyticsRouter.route("/stock", stockRouter);

export default analyticsRouter;
