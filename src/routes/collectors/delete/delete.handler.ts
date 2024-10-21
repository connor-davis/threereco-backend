import { eq } from "drizzle-orm";

import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import { collections } from "@/schemas/collection";
import collectors from "@/schemas/collector";
import users from "@/schemas/user";

import { DeleteCollectorRoute } from "./delete.route";

const deleteCollectorHandler: KalimbuRoute<DeleteCollectorRoute> = async (
  context
) => {
  const params = context.req.valid("param");

  const collector = await database.query.collectors.findFirst({
    where: (collectors, { eq }) => eq(collectors.id, params.id),
  });

  if (!collector)
    return context.json(
      { message: "The collector was not found." },
      HttpStatus.NOT_FOUND
    );

  await database
    .delete(collections)
    .where(eq(collections.collectorId, params.id));
  await database.delete(collectors).where(eq(collectors.id, params.id));
  await database.delete(users).where(eq(users.id, collector.userId));

  return context.text("ok", HttpStatus.OK);
};

export default deleteCollectorHandler;
