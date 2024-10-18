import configureOpenAPI from "@/lib/configure-openapi";
import configureScalar from "@/lib/configure-scalar";
import createApp from "@/lib/create-app";

import authentication from "./routes/authentication/authentication.router";
import businesses from "./routes/businesses/businesses.router";
import collectors from "./routes/collectors/collectors.router";
import index from "./routes/index.router";
import products from "./routes/products/products.router";
import users from "./routes/users/users.router";

const app = createApp();

const apiRoutes = [
  index,
  authentication,
  users,
  businesses,
  collectors,
  products,
];

configureOpenAPI(app);
configureScalar(app);

apiRoutes.forEach((route) => app.route("/api", route));

export default app;
