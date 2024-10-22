import createRouter from "@/lib/create-router";

import createProductHandler from "./create/create.handler";
import createProductRoute from "./create/create.route";
import deleteProductHandler from "./delete/delete.handler";
import deleteProductRoute from "./delete/delete.route";
import productsPagingHandler from "./paging/paging.handler";
import productsPagingRoute from "./paging/paging.route";
import updateProductHandler from "./update/update.handler";
import updateProductRoute from "./update/update.route";
import { viewProductHandler, viewProductsHandler } from "./view/view.handler";
import { viewProductRoute, viewProductsRoute } from "./view/view.route";

const products = createRouter()
  .openapi(productsPagingRoute, productsPagingHandler)
  .openapi(viewProductsRoute, viewProductsHandler)
  .openapi(viewProductRoute, viewProductHandler)
  .openapi(createProductRoute, createProductHandler)
  .openapi(deleteProductRoute, deleteProductHandler)
  .openapi(updateProductRoute, updateProductHandler);

export default products;
