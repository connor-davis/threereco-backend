import createRouter from "@/lib/create-router";

import createCollectionHandler from "./create/create.handler";
import createCollectionRoute from "./create/create.route";
import deleteCollectionHandler from "./delete/delete.handler";
import deleteCollectionRoute from "./delete/delete.route";
import exportCollectionsHandler from "./export/export.handler";
import exportCollectionsRoute from "./export/export.route";
import collectionsPagingHandler from "./paging/paging.handler";
import collectionsPagingRoute from "./paging/paging.route";
import updateCollectionHandler from "./update/update.handler";
import updateCollectionRoute from "./update/update.route";
import {
  viewCollectionHandler,
  viewCollectionsHandler,
} from "./view/view.handler";
import { viewCollectionRoute, viewCollectionsRoute } from "./view/view.route";

const collections = createRouter()
  .openapi(collectionsPagingRoute, collectionsPagingHandler)
  .openapi(viewCollectionsRoute, viewCollectionsHandler)
  .openapi(viewCollectionRoute, viewCollectionHandler)
  .openapi(createCollectionRoute, createCollectionHandler)
  .openapi(deleteCollectionRoute, deleteCollectionHandler)
  .openapi(updateCollectionRoute, updateCollectionHandler)
  .openapi(exportCollectionsRoute, exportCollectionsHandler);

export default collections;
