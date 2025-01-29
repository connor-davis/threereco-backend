import { businessUser, businesses, userBusinesses } from "./business";
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
import { collectorUser, collectors, userCollectors } from "./collector";
import { businessProducts, productBusiness, products } from "./products";
import roles from "./roles";
import {
  businessTransactions,
  transactionBusinessBuyer,
  transactionBusinessSeller,
  transactionCollectorBuyer,
  transactionCollectorSeller,
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
  transactionBusinessBuyer,
  transactionBusinessSeller,
  transactionCollectorBuyer,
  transactionCollectorSeller,
  businessTransactions,
};
