import "reflect-metadata";
import "dotenv/config";
require("events").EventEmitter.defaultMaxListeners = 15;
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";
import Cors from "cors";
import Session from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import { createSchema } from "./util/createSchema";
import { UserResolver } from "./modules/user-resolver/user";
// import { User } from "./Entity/users";
const RedisStore = connectRedis(Session as any);

const main = async () => {
  await createConnection();
  const schema = await createSchema();

  const apollo = new ApolloServer({
    schema: schema,
    resolvers: [UserResolver as any],
    context: ({ req, res }: any) => {
      return { req, res };
    },
  });

  const app = express();

  app.use(Cors({ credentials: true, origin: "http://localhost:3000" }));

  app.use(
    Session({
      store: new RedisStore({
        client: new Redis(),
      }),
      name: "msh",
      secret: process.env.SESSION_SECRET as any,
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    })
  );

  apollo.applyMiddleware({ app });
  app.listen(4000, async () => {
    console.log("apollo server is connected");
  });
};
main();
