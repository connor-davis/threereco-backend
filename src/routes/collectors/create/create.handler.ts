import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import { collectors, selectCollectorsSchema } from "@/schemas/collector";

import { CreateCollectorRoute } from "./create.route";

const createCollectorHandler: KalimbuRoute<CreateCollectorRoute> = async (
  context
) => {
  const payload = context.req.valid("json");

  const existingCollectorWithIdNumber =
    await database.query.collectors.findFirst({
      where: (collectors, { eq }) => eq(collectors.idNumber, payload.idNumber),
    });

  const existingCollectorWithAccountNumber =
    await database.query.collectors.findFirst({
      where: (collectors, { eq }) =>
        eq(collectors.bankAccountNumber, payload.bankAccountNumber),
    });

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

  const collector = await database
    .insert(collectors)
    .values(payload)
    .returning();

  return context.json(
    selectCollectorsSchema.parse(collector[0]),
    HttpStatus.OK
  );
};

export default createCollectorHandler;
