import {
  businessProducts as businessProductsSchema,
  productsBusiness as productsBusinessesSchema,
  products as productsSchema,
} from "./products";
import {
  businesses as businessesSchema,
  businessUser as businessesUsersSchema,
  userBusinesses as userBusinessesSchema,
} from "./businesses";
import {
  businesssTransactions as businessTransactionsSchema,
  transactionsBuyer as transactionsBuyerSchema,
  transactionsSeller as transactionsSellerSchema,
  transactions as transactionsSchema,
} from "./transactions";
import {
  collectors as collectorsSchema,
  collectorsUser as collectorsUsersSchema,
  userCollectors as userCollectorsSchema,
} from "./collectors";

import { businessTypes as businessTypesSchema } from "./businessTypes";
import { roles as rolesSchema } from "./roles";
import { users as usersSchema } from "./users";

export const businessTypes = businessTypesSchema;
export const users = usersSchema;
export const roles = rolesSchema;

export const businesses = businessesSchema;
export const businessesUsers = businessesUsersSchema;
export const userBusinesses = userBusinessesSchema;

export const collectors = collectorsSchema;
export const collectorsUsers = collectorsUsersSchema;
export const userCollectors = userCollectorsSchema;

export const products = productsSchema;
export const productsBusinesses = productsBusinessesSchema;
export const businessProducts = businessProductsSchema;

export const transactions = transactionsSchema;
export const transactionsBuyer = transactionsBuyerSchema;
export const transactionsSeller = transactionsSellerSchema;
export const businessTransactions = businessTransactionsSchema;
