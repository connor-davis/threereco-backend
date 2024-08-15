import { OpenAPIHono } from "@hono/zod-openapi";
import createUserRouter from "./create";

const usersRouter = new OpenAPIHono();

usersRouter.route("/", createUserRouter);

export default usersRouter;
