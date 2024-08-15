import { OpenAPIHono } from "@hono/zod-openapi";
import authentication from "./authentication";
import users from "./users";

const router = new OpenAPIHono();

router.route("/authentication", authentication);
router.route("/users", users);

export default router;
