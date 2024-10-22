import createRouter from "@/lib/create-router";

import createCollectorHandler from "./create/create.handler";
import createCollectorRoute from "./create/create.route";
import deleteCollectorHandler from "./delete/delete.handler";
import deleteCollectorRoute from "./delete/delete.route";
import collectorsPagingHandler from "./paging/paging.handler";
import collectorsPagingRoute from "./paging/paging.route";
import updateCollectorHandler from "./update/update.handler";
import updateCollectorRoute from "./update/update.route";
import {
  viewCollectorHandler,
  viewCollectorsHandler,
} from "./view/view.handler";
import { viewCollectorRoute, viewCollectorsRoute } from "./view/view.route";

const collectors = createRouter()
  .openapi(collectorsPagingRoute, collectorsPagingHandler)
  .openapi(viewCollectorsRoute, viewCollectorsHandler)
  .openapi(viewCollectorRoute, viewCollectorHandler)
  .openapi(createCollectorRoute, createCollectorHandler)
  .openapi(deleteCollectorRoute, deleteCollectorHandler)
  .openapi(updateCollectorRoute, updateCollectorHandler);

export default collectors;
