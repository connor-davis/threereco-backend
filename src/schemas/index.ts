import businesses, { businessUser, userBusinesses } from "./business";
import businessTypes from "./businessTypes";
import {
  businessCollections,
  collectionBusiness,
  collectionCollector,
  collectionProduct,
  collections,
  collectorCollections,
  productCollections,
} from "./collection";
import collectors, { collectorUser, userCollectors } from "./collector";
import { businessProducts, productBusiness, products } from "./products";
import roles from "./roles";
import {
  businessTransactions,
  transactionBuyer,
  transactionSeller,
  transactions,
} from "./transaction";
import users from "./user";

export default {
  users,
  roles,
  businesses,
  businessTypes,
  businessUser,
  userBusinesses,
  collectors,
  collectorUser,
  userCollectors,
  products,
  productBusiness,
  businessProducts,
  collections,
  collectionBusiness,
  collectionCollector,
  collectionProduct,
  businessCollections,
  collectorCollections,
  productCollections,
  transactions,
  transactionBuyer,
  transactionSeller,
  businessTransactions,
};
