import { graphql, GraphQLSchema } from "graphql";
import { Maybe } from "type-graphql";
import { createSchema } from "../util/createSchema";
interface options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
  userId?: number;
}
let schema: GraphQLSchema;
export const gCall = async ({ source, variableValues, userId }: options) => {
  if (!schema) {
    schema = await createSchema();
  }
  console.log(variableValues);

  return graphql({
    schema,
    source,
    variableValues,
    contextValue: {
      req: {
        session: {
          userId,
        },
      },
      res: {
        clearCookie: jest.fn(),
      },
    },
  });
};
