import { User } from "../Entity/User";
import { Connection, getRepository } from "typeorm";
import { testConn } from "../test-utils/testconn";

let conn: Connection;
beforeAll(async () => {
  conn = await testConn(true);
  const user = getRepository(User);
  const mainUser = user.create({
    firstName: "test",
    lastName: "test",
    password: "tester123",
    age: 22,
    email: "test@test.com",
  });
  await user.save(mainUser);
});
afterAll(async () => {
  if (conn) {
    await conn.close();
  }
});
