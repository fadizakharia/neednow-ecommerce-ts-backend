import { createConnection } from "typeorm";

export const testConn = (drop: boolean = false) => {
  return createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "fadizakharia",
    password: "",
    database: "ecom-test",
    synchronize: drop,
    dropSchema: drop,
    entities: [__dirname + "/../Entity/**/*.ts"],
    migrations: [__dirname + "/../migrations/**/*.ts"],
    subscribers: [__dirname + "/../subscriber/**/*.ts"],
  });
};
