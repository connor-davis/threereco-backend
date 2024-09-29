import { Hono } from "hono";
import viewTransactionsRouter from "./view";

const transactionsRouter = new Hono();

transactionsRouter.route("/", viewTransactionsRouter);

export default transactionsRouter;
