import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import { selectCollectorsSchema } from "@/schemas/collector";

import { ViewCollectorRoute, ViewCollectorsRoute } from "./view.route";

export const viewCollectorsHandler: KalimbuRoute<ViewCollectorsRoute> = async (
  context
) => {
  const query = context.req.valid("query");

  const collectors = await database.query.collectors.findMany({
    with: {
      user: query.includeUser,
    },
    limit: query.count,
    offset: query.count * (query.page - 1),
  });

  return context.json(
    collectors.map((collector) => selectCollectorsSchema.parse(collector)),
    HttpStatus.OK
  );
};

export const viewCollectorHandler: KalimbuRoute<ViewCollectorRoute> = async (
  context
) => {
  const params = context.req.valid("param");
  const query = context.req.valid("query");

  const collector = await database.query.collectors.findFirst({
    where: (collectors, { eq }) => eq(collectors.id, params.id!),
    with: {
      user: query.includeUser,
    },
  });

  if (!collector)
    return context.json(
      { message: "The collector was not found." },
      HttpStatus.NOT_FOUND
    );

  return context.json(selectCollectorsSchema.parse(collector), HttpStatus.OK);
};
