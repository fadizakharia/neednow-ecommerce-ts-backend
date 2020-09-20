import { Connection } from "typeorm";
import { testConn } from "../test-utils/testconn";

let conn: Connection;
beforeAll(async () => {
  conn = await testConn(true);
});
afterAll(async () => {
  if (conn) {
    await conn.close();
  }
});
