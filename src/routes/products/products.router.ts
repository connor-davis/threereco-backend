import createRouter from "@/lib/create-router";

import createProductHandler from "./create/create.handler";
import createProductRoute from "./create/create.route";
import deleteProductHandler from "./delete/delete.handler";
import deleteProductRoute from "./delete/delete.route";
import updateProductHandler from "./update/update.handler";
import updateProductRoute from "./update/update.route";
import viewProductsHandler from "./view/view.handler";
import viewProductsRoute from "./view/view.route";

const products = createRouter()
  .openapi(viewProductsRoute, viewProductsHandler)
  .openapi(createProductRoute, createProductHandler)
  .openapi(deleteProductRoute, deleteProductHandler)
  .openapi(updateProductRoute, updateProductHandler);

export default products;
