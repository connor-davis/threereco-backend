import createRouter from "@/lib/create-router";

import createUserHandler from "./create/create.handler";
import createUserRoute from "./create/create.route";
import deleteUserHandler from "./delete/delete.handler";
import deleteUserRoute from "./delete/delete.route";
import updateUserHandler from "./update/update.handler";
import updateUserRoute from "./update/update.route";
import viewUsersHandler from "./view/view.handler";
import viewUsersRoute from "./view/view.route";

const users = createRouter()
  .openapi(viewUsersRoute, viewUsersHandler)
  .openapi(createUserRoute, createUserHandler)
  .openapi(updateUserRoute, updateUserHandler)
  .openapi(deleteUserRoute, deleteUserHandler);

export default users;
