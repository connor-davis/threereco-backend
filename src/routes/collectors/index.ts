import { Hono } from "hono";
import createCollectorRouter from "./create";
import updateCollectorRouter from "./update";
import deleteCollectorRouter from "./delete";
import viewCollectorsRouter from "./view";

const collectorsRouter = new Hono();

collectorsRouter.route("/", createCollectorRouter);
collectorsRouter.route("/", updateCollectorRouter);
collectorsRouter.route("/", deleteCollectorRouter);
collectorsRouter.route("/", viewCollectorsRouter);

export default collectorsRouter;
