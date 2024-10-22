import createRouter from "@/lib/create-router";

import createUserHandler from "./create/create.handler";
import createUserRoute from "./create/create.route";
import deleteAccountHandler from "./delete-account/deleteAccount.handler";
import deleteAccountRoute from "./delete-account/deleteAccount.route";
import deleteUserHandler from "./delete/delete.handler";
import deleteUserRoute from "./delete/delete.route";
import usersPagingHandler from "./paging/paging.handler";
import usersPagingRoute from "./paging/paging.route";
import updateUserHandler from "./update/update.handler";
import updateUserRoute from "./update/update.route";
import { viewUserHandler, viewUsersHandler } from "./view/view.handler";
import { viewUserRoute, viewUsersRoute } from "./view/view.route";

const users = createRouter()
  .openapi(usersPagingRoute, usersPagingHandler)
  .openapi(viewUsersRoute, viewUsersHandler)
  .openapi(viewUserRoute, viewUserHandler)
  .openapi(createUserRoute, createUserHandler)
  .openapi(updateUserRoute, updateUserHandler)
  .openapi(deleteUserRoute, deleteUserHandler)
  .openapi(deleteAccountRoute, deleteAccountHandler);

export default users;
