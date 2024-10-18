import { eq } from "drizzle-orm";

import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import { collections } from "@/schemas/collection";
import { products } from "@/schemas/products";

import { DeleteProductRoute } from "./delete.route";

const deleteProductHandler: KalimbuRoute<DeleteProductRoute> = async (
  context
) => {
  const query = context.req.valid("query");

  const product = await database.query.products.findFirst({
    where: (products, { eq }) => eq(products.id, query.id),
  });

  if (!product)
    return context.json(
      { message: "The product was not found." },
      HttpStatus.NOT_FOUND
    );

  await database.delete(collections).where(eq(collections.productId, query.id));
  await database.delete(products).where(eq(products.id, query.id));

  return context.text("ok", HttpStatus.OK);
};

export default deleteProductHandler;
