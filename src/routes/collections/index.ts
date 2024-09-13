import { Hono } from "hono";
import createCollectionRouter from "./create";
import updateCollectionRouter from "./update";
import deleteCollectionRouter from "./delete";
import viewCollectionsRouter from "./view";

const collectionsRouter = new Hono();

collectionsRouter.route("/", createCollectionRouter);
collectionsRouter.route("/", updateCollectionRouter);
collectionsRouter.route("/", deleteCollectionRouter);
collectionsRouter.route("/", viewCollectionsRouter);

export default collectionsRouter;
