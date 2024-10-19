import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import { selectCollectorsSchema } from "@/schemas/collector";

import { ViewCollectorsRoute } from "./view.route";

const viewCollectorsHandler: KalimbuRoute<ViewCollectorsRoute> = async (
  context
) => {
  const query = context.req.valid("query");

  if (query.id) {
    const collector = await database.query.collectors.findFirst({
      where: (collectors, { eq }) => eq(collectors.id, query.id!),
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
  } else {
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
  }
};

export default viewCollectorsHandler;
