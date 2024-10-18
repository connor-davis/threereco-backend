import createRouter from "@/lib/create-router";

import createCollectionHandler from "./create/create.handler";
import createCollectionRoute from "./create/create.route";
import deleteCollectionHandler from "./delete/delete.handler";
import deleteCollectionRoute from "./delete/delete.route";
import updateCollectionHandler from "./update/update.handler";
import updateCollectionRoute from "./update/update.route";
import viewCollectionsHandler from "./view/view.handler";
import viewCollectionsRoute from "./view/view.route";

const collections = createRouter()
  .openapi(viewCollectionsRoute, viewCollectionsHandler)
  .openapi(createCollectionRoute, createCollectionHandler)
  .openapi(deleteCollectionRoute, deleteCollectionHandler)
  .openapi(updateCollectionRoute, updateCollectionHandler);

export default collections;
