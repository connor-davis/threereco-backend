import { Hono } from "hono";
import createUserRouter from "./create";
import viewUsersRouter from "./view";
import deleteUserRouter from "./delete";
import updateUserRouter from "./update";
import userImageRouter from "./image";

const usersRouter = new Hono();

usersRouter.route("/", createUserRouter);
usersRouter.route("/", updateUserRouter);
usersRouter.route("/", deleteUserRouter);
usersRouter.route("/", viewUsersRouter);
usersRouter.route("/image", userImageRouter);

export default usersRouter;
