import { eq } from "drizzle-orm";

import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import { collections } from "@/schemas/collection";
import collectors from "@/schemas/collector";

import { DeleteCollectorRoute } from "./delete.route";

const deleteCollectorHandler: KalimbuRoute<DeleteCollectorRoute> = async (
  context
) => {
  const query = context.req.valid("query");

  const collector = await database.query.collectors.findFirst({
    where: (collectors, { eq }) => eq(collectors.id, query.id),
  });

  if (!collector)
    return context.json(
      { message: "The collector was not found." },
      HttpStatus.NOT_FOUND
    );

  await database
    .delete(collections)
    .where(eq(collections.collectorId, query.id));
  await database.delete(collectors).where(eq(collectors.id, query.id));

  return context.text("ok", HttpStatus.OK);
};

export default deleteCollectorHandler;
