import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import collectors, { selectCollectorsSchema } from "@/schemas/collector";

import { UpdateCollectorRoute } from "./update.route";

const updateCollectorHandler: KalimbuRoute<UpdateCollectorRoute> = async (
  context
) => {
  const query = context.req.valid("query");
  const payload = context.req.valid("json");

  const existingCollector = await database.query.collectors.findFirst({
    where: (collectors, { eq }) => eq(collectors.id, query.id),
  });

  const existingCollectorWithIdNumber =
    await database.query.collectors.findFirst({
      where: (collectors, { eq, not, and }) =>
        and(
          eq(collectors.idNumber, payload.idNumber),
          not(eq(collectors.id, query.id))
        ),
    });

  const existingCollectorWithAccountNumber =
    await database.query.collectors.findFirst({
      where: (collectors, { eq, not, and }) =>
        and(
          eq(collectors.bankAccountNumber, payload.bankAccountNumber),
          not(eq(collectors.id, query.id))
        ),
    });

  if (!existingCollector)
    return context.json(
      { message: "The collector was not found." },
      HttpStatus.NOT_FOUND
    );

  if (existingCollectorWithIdNumber)
    return context.json(
      {
        message: "There is already a collector with that ID number.",
      },
      HttpStatus.CONFLICT
    );

  if (existingCollectorWithAccountNumber)
    return context.json(
      { message: "There is already a collector with that account number." },
      HttpStatus.CONFLICT
    );

  const collector = await database.update(collectors).set(payload).returning();

  return context.json(
    selectCollectorsSchema.parse(collector[0]),
    HttpStatus.OK
  );
};

export default updateCollectorHandler;
