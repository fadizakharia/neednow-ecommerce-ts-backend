import { buildSchema } from "type-graphql";
import { UserResolver } from "../modules/user-resolver/user";
import { StoreResolver } from "../modules/store-resolver/store";
import { ProductResolver } from "../modules/product-resolver/product";
import { cartResolver } from "../modules/cart-resolver/cart";
export const createSchema = async () => {
  return buildSchema({
    resolvers: [UserResolver, StoreResolver, ProductResolver, cartResolver],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    },
    validate: false,
  });
};
