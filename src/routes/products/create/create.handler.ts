import database from "@/lib/database";
import HttpStatus from "@/lib/http-status";
import { KalimbuRoute } from "@/lib/types";
import { products, selectProductsSchema } from "@/schemas/products";

import { CreateProductRoute } from "./create.route";

const createProductHandler: KalimbuRoute<CreateProductRoute> = async (
  context
) => {
  const session = context.var.session;
  const userId = session.get("user_id") as string;
  const userRole = session.get("user_role") as string;

  const payload = context.req.valid("json");

  const business = await database.query.businesses.findFirst({
    where: (businesses, { eq, and }) =>
      and(userRole === "business" ? eq(businesses.userId, userId) : undefined),
  });

  const existingProduct = await database.query.products.findFirst({
    where: (products, { eq, and }) =>
      userRole === "business"
        ? and(
            eq(products.businessId, business!.id),
            eq(products.name, payload.name)
          )
        : and(
            eq(products.businessId, payload.businessId!),
            eq(products.name, payload.name)
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
    .insert(products)
    .values({
      ...payload,
      businessId: userRole === "business" ? business!.id : payload.businessId!,
    })
    .returning();

  return context.json(selectProductsSchema.parse(product[0]), HttpStatus.OK);
};

export default createProductHandler;
