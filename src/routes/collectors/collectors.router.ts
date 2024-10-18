import createRouter from "@/lib/create-router";

import createCollectorHandler from "./create/create.handler";
import createCollectorRoute from "./create/create.route";
import deleteCollectorHandler from "./delete/delete.handler";
import deleteCollectorRoute from "./delete/delete.route";
import updateCollectorHandler from "./update/update.handler";
import updateCollectorRoute from "./update/update.route";
import viewCollectorsHandler from "./view/view.handler";
import viewCollectorsRoute from "./view/view.route";

const collectors = createRouter()
  .openapi(viewCollectorsRoute, viewCollectorsHandler)
  .openapi(createCollectorRoute, createCollectorHandler)
  .openapi(deleteCollectorRoute, deleteCollectorHandler)
  .openapi(updateCollectorRoute, updateCollectorHandler);

export default collectors;
