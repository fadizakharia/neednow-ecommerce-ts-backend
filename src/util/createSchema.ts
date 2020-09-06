import { buildSchema } from "type-graphql";
import { UserResolver } from "../modules/user-resolver/user";
export const createSchema = async () => {
  return buildSchema({
    resolvers: [UserResolver],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    },
  });
};
