import createRouter from "@/lib/create-router";

import createUserHandler from "./create/create.handler";
import createUserRoute from "./create/create.route";
import deleteUserHandler from "./delete/delete.handler";
import deleteUserRoute from "./delete/delete.route";
import updateUserHandler from "./update/update.handler";
import updateUserRoute from "./update/update.route";
import listUsersHandler from "./view/list.handler";
import listUsersRoute from "./view/list.route";
import singleUserHandler from "./view/single.handler";
import singleUserRoute from "./view/single.route";

const users = createRouter()
  .openapi(listUsersRoute, listUsersHandler)
  .openapi(singleUserRoute, singleUserHandler)
  .openapi(createUserRoute, createUserHandler)
  .openapi(updateUserRoute, updateUserHandler)
  .openapi(deleteUserRoute, deleteUserHandler);

export default users;
