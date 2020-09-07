import { testConn } from "../../test-utils/testconn";
import { Connection } from "typeorm";

import { gCall } from "../../test-utils/gCall";
import { ArgumentValidationError } from "type-graphql";
import { UserResponse } from "./signup/signup-response";

let conn: Connection;
beforeAll(async () => {
  conn = await testConn(true);
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
errors{
  field
  message
}
}
}`;
const loginMutation = `mutation Login($data: SigninInput!){
signin(data:$data){
 user{
  id
  firstName
  lastName
  email
}
errors{
  field
  message
}
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
    const userResponse = result.data!.signup as UserResponse;
    expect(userResponse.user).toBe(null);
    expect(userResponse.errors![0].field).toBe("Email");
    expect(userResponse.errors![0].message).toBe("User Already Exists!");
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
    const userResponse = result.data!.signin as UserResponse;
    expect(userResponse.user).toBe(null);
    expect(userResponse.errors![0].field).toBe("signin");
    expect(userResponse.errors![0].message).toBe(
      "username or password mismatch"
    );
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
    const userResponse = result.data!.signin as UserResponse;
    expect(userResponse.user).toBe(null);
    expect(userResponse.errors![0].field).toBe("signin");
    expect(userResponse.errors![0].message).toBe(
      "username or password mismatch"
    );
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
    expect(result.data!.signin.user.id).toBe("1");
    expect(result.data!.signin.user.email).toBe("fadi@fadi.com");
    expect(result.data!.signin.user.firstName).toBe("fadi");
    expect(result.data!.signin.user.lastName).toBe("zakharia");
  });
});
