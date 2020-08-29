import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { Users } from "./resolvers/users";

const app = express();
const main = async () => {
  const connection = await createConnection();
  const apollo = new ApolloServer({
    schema: await buildSchema({
      resolvers: [Users],
      validate: false,
    }),
    context: connection,
  });
  apollo.applyMiddleware({ app });
  app.listen(4000, async () => {
    console.log("apollo server is connected");
  });
};
main();
