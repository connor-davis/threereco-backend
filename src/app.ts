import configureOpenAPI from "@/lib/configure-openapi";
import configureScalar from "@/lib/configure-scalar";
import createApp from "@/lib/create-app";

import authentication from "./routes/authentication/authentication.router";
import index from "./routes/index.router";

const app = createApp();

const apiRoutes = [index, authentication];

configureOpenAPI(app);
configureScalar(app);

apiRoutes.forEach((route) => app.route("/api", route));

export default app;
