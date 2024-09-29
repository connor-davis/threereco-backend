import { OpenAPIHono } from "@hono/zod-openapi";
import authenticationRouter from "./authentication";
import usersRouter from "./users";
import businessesRouter from "./businesses";
import collectorsRouter from "./collectors";
import productsRouter from "./products";
import collectionsRouter from "./collections";
import analyticsRouter from "./analytics";
import transactionsRouter from "./transactions";
import marketRouter from "./market";

const router = new OpenAPIHono();

router.route("/authentication", authenticationRouter);
router.route("/users", usersRouter);
router.route("/businesses", businessesRouter);
router.route("/collectors", collectorsRouter);
router.route("/collections", collectionsRouter);
router.route("/products", productsRouter);
router.route("/analytics", analyticsRouter);
router.route("/transactions", transactionsRouter);
router.route("/market", marketRouter);

export default router;
