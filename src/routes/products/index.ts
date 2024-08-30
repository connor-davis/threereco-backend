import { Hono } from "hono";
import createProductRouter from "./create";
import updateProductRouter from "./update";
import deleteProductRouter from "./delete";
import viewProductsRouter from "./view";

const productsRouter = new Hono();

productsRouter.route("/", createProductRouter);
productsRouter.route("/", updateProductRouter);
productsRouter.route("/", deleteProductRouter);
productsRouter.route("/", viewProductsRouter);

export default productsRouter;
