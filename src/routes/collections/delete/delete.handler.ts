import { eq } from "drizzle-orm";

import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import { collections } from "@/schemas/collection";

import { DeleteCollectionRoute } from "./delete.route";

const deleteCollectionHandler: KalimbuRoute<DeleteCollectionRoute> = async (
  context
) => {
  const params = context.req.valid("param");

  const collection = await database.query.collections.findFirst({
    where: (collections, { eq }) => eq(collections.id, params.id),
  });

  if (!collection)
    return context.json(
      { message: "The collection was not found." },
      HttpStatus.NOT_FOUND
    );

  await database.delete(collections).where(eq(collections.id, params.id));

  return context.text("ok", HttpStatus.OK);
};

export default deleteCollectionHandler;
