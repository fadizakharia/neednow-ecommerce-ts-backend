import { buildSchema } from "type-graphql";
import { UserResolver } from "../modules/user-resolver/user";
import { StoreResolver } from "../modules/store-resolver/store";
import { ProductResolver } from "../modules/product-resolver/product";
export const createSchema = async () => {
  return buildSchema({
    resolvers: [UserResolver, StoreResolver, ProductResolver],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    },
  });
};
