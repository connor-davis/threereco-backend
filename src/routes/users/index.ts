import { Hono } from "hono";
import createUserRouter from "./create";
import viewUsersRouter from "./view";

const usersRouter = new Hono();

usersRouter.route("/", viewUsersRouter);
usersRouter.route("/", createUserRouter);

export default usersRouter;
