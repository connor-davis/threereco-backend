import { OpenAPIHono } from "@hono/zod-openapi";
import authenticationRouter from "./authentication";
import usersRouter from "./users";
import businessesRouter from "./businesses";

const router = new OpenAPIHono();

router.route("/authentication", authenticationRouter);
router.route("/users", usersRouter);
router.route("/businesses", businessesRouter);

export default router;
