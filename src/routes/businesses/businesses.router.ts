import createRouter from "@/lib/create-router";

import createBusinessHandler from "./create/create.handler";
import createBusinessRoute from "./create/create.route";
import viewBusinessesHandler from "./view/view.handler";
import viewBusinessesRoute from "./view/view.route";

const businesses = createRouter()
  .openapi(viewBusinessesRoute, viewBusinessesHandler)
  .openapi(createBusinessRoute, createBusinessHandler);

export default businesses;
