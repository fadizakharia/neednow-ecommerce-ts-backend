import { buildSchema } from "type-graphql";
import { UserResolver } from "../modules/user-resolver/user";
import { StoreResolver } from "../modules/store-resolver/store";
export const createSchema = async () => {
  return buildSchema({
    resolvers: [UserResolver, StoreResolver],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    },
  });
};
