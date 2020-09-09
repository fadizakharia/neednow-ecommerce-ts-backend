import { testConn } from "../../test-utils/testconn";
import { Connection } from "typeorm";

import { gCall } from "../../test-utils/gCall";
import { ArgumentValidationError } from "type-graphql";

let conn: Connection;
beforeAll(async () => {
  conn = await testConn(true);
});
afterAll(async () => {
  await conn!.close();
});
const registerMutation = `mutation Register($data: RegInput!){
signup(data:$data){
  id
  firstName
  lastName
  email
}
}`;
const loginMutation = `mutation Login($data: SigninInput!){
signin(data:$data){
  id
  firstName
  lastName
  email
}
}`;
describe("Register", () => {
  it("should create a user if arguements are valid", async () => {
    const result = await gCall({
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
    expect(result.data).not.toBe(null);
  });
  it("should not create a user if user already exists", async () => {
    const result = await gCall({
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
    const validationError = result.errors![0]
      .originalError as ArgumentValidationError;
    expect(validationError).toBeInstanceOf(ArgumentValidationError);
    expect(validationError.validationErrors).toHaveLength(1);
    expect(validationError.validationErrors[0].property).toBe("email");
  });

  it("should not create a user if arguements are invalid", async () => {
    const result = await gCall({
      source: registerMutation,
      variableValues: {
        data: {
          firstName: "fadi",
          lastName: "zakharia",
          email: "fadi.fadi",
          password: "teste",
          age: 12,
        },
      },
    });

    expect(result.data).toBeNull();
    expect(result.errors).toHaveLength(1);
    const validationError = result.errors![0]
      .originalError as ArgumentValidationError;
    expect(validationError).toBeInstanceOf(ArgumentValidationError);
    expect(validationError.validationErrors).toHaveLength(3);
    expect(validationError.validationErrors[0].property).toBe("email");
    expect(validationError.validationErrors[1].property).toBe("age");
    expect(validationError.validationErrors[2].property).toBe("password");
  });
});
describe("login", () => {
  it("should not log in user if arguements are invalid", async () => {
    const result = await gCall({
      source: loginMutation,
      variableValues: {
        data: {
          email: "fadifadi",
          password: "idgaf",
        },
      },
    });
    expect(result.data).toBeNull();
    expect(result.errors).toHaveLength(1);
    const validationError = result.errors![0]
      .originalError as ArgumentValidationError;
    expect(validationError).toBeInstanceOf(ArgumentValidationError);
    expect(validationError.validationErrors).toHaveLength(2);
    expect(validationError.validationErrors[0].property).toBe("email");
    expect(validationError.validationErrors[1].property).toBe("password");
  });
  it("should not log in user if email is invalid", async () => {
    const result = await gCall({
      source: loginMutation,
      variableValues: {
        data: {
          email: "fadi@test.com",
          password: "testenvss",
        },
      },
    });
    const validationError = result.errors![0]
      .originalError as ArgumentValidationError;
    expect(validationError).toBeInstanceOf(ArgumentValidationError);
    expect(validationError.validationErrors).toHaveLength(1);
    expect(validationError.validationErrors[0].property).toBe("password");
  });
  it("should not log in user if password is invalid", async () => {
    const result = await gCall({
      source: loginMutation,
      variableValues: {
        data: {
          email: "fadi@fadi.com",
          password: "testenvsz",
        },
      },
    });
    const validationError = result.errors![0]
      .originalError as ArgumentValidationError;
    expect(validationError).toBeInstanceOf(ArgumentValidationError);
    expect(validationError.validationErrors).toHaveLength(1);
    expect(validationError.validationErrors[0].property).toBe("password");
  });
  it("should login user if email and password are correct credentials", async () => {
    const result = await gCall({
      source: loginMutation,
      variableValues: {
        data: {
          email: "fadi@fadi.com",
          password: "testenvss",
        },
      },
    });
    expect(result.data).not.toBeNull();
    expect(result.data!.signin.id).toBe("1");
    expect(result.data!.signin.email).toBe("fadi@fadi.com");
    expect(result.data!.signin.firstName).toBe("fadi");
    expect(result.data!.signin.lastName).toBe("zakharia");
  });
});
