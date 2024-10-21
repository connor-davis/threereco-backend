import { eq } from "drizzle-orm";

import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import { products, selectProductsSchema } from "@/schemas/products";

import { UpdateProductRoute } from "./update.route";

const updateProductHandler: KalimbuRoute<UpdateProductRoute> = async (
  context
) => {
  const session = context.var.session;
  const userId = session.get("user_id") as string;
  const userRole = session.get("user_role") as string;

  const payload = context.req.valid("json");
  const params = context.req.valid("param");

  const business = await database.query.businesses.findFirst({
    where: (businesses, { eq, and }) =>
      and(userRole === "business" ? eq(businesses.userId, userId) : undefined),
  });

  const existingProduct = await database.query.products.findFirst({
    where: (products, { eq, and, not }) =>
      userRole === "business"
        ? and(
            eq(products.businessId, business!.id),
            eq(products.name, payload.name),
            not(eq(products.id, params.id))
          )
        : and(
            eq(products.businessId, payload.businessId!),
            eq(products.name, payload.name),
            not(eq(products.id, params.id))
          ),
  });

  if (existingProduct)
    return context.json(
      {
        message: "There is already a product with that name.",
      },
      HttpStatus.CONFLICT
    );

  const product = await database
    .update(products)
    .set({
      ...payload,
      businessId: userRole === "business" ? business!.id : payload.businessId!,
    })
    .where(eq(products.id, params.id))
    .returning();

  return context.json(selectProductsSchema.parse(product[0]), HttpStatus.OK);
};

export default updateProductHandler;
