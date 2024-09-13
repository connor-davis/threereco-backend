import { OpenAPIHono } from "@hono/zod-openapi";
import authenticationRouter from "./authentication";
import usersRouter from "./users";
import businessesRouter from "./businesses";
import collectorsRouter from "./collectors";
import productsRouter from "./products";
import collectionsRouter from "./collections";

const router = new OpenAPIHono();

router.route("/authentication", authenticationRouter);
router.route("/users", usersRouter);
router.route("/businesses", businessesRouter);
router.route("/collectors", collectorsRouter);
router.route("/collections", collectionsRouter);
router.route("/products", productsRouter);

export default router;
