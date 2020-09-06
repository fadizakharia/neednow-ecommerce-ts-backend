import { testConn } from "../../test-utils/testconn";
import { Connection } from "typeorm";

import { gCall } from "../../test-utils/gCall";

let conn: Connection;
beforeAll(async () => {
  conn = await testConn(true);
  // console.log(conn.getMetadata("name"));
});
afterAll(async () => {
  await conn!.close();
});
const registerMutation = `mutation Register($data: RegInput!){
signup(data:$data){
 user{
  id
  firstName
  lastName
  email
}
}
}`;
describe("Register", () => {
  it("create user", async () => {
    const call = await gCall({
      source: registerMutation,
      variableValues: {
        data: {
          firstName: "fadi",
          lastName: "zakharia",
          email: "fadi@fadi.com",
          password: "testenvss",
          age: 19,
        },
      },
    });
    console.log(call.data);
  });
});
