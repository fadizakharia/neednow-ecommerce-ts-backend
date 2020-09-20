// import { testConn } from "../../test-utils/testconn";
import { gCall } from "../../test-utils/gCall";
import { clearUsers, signin, signup } from "../../test-utils/sharedTest";
// import { Connection } from "typeorm";

const registerMutation = `mutation Register($data: RegInput!){
signup(data:$data){
    user{
    id
    firstName
    lastName
    email
  }
  errors
  {
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
afterAll(async () => {
  await clearUsers();
});
describe("Register", () => {
  it("should create a user if arguements are valid", async () => {
    const result = await signup();
    expect(result.data!.signup.user).not.toBeNull();
    expect(result.data!.signup.errors).toBeNull();
  });
  it("should not create a user if user already exists", async () => {
    const result = await signup();
    expect(result.data!.signup.user).toBeNull();
    const validationError = result.data!.signup.errors[0];
    expect(validationError.field).toBe("email");
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

    expect(result.data!.signup.user).toBeNull();
    const validationError = result.data!.signup.errors;

    expect(validationError).toHaveLength(3);
    expect(validationError[0].field).toBe("age");
    expect(validationError[1].field).toBe("email");
    expect(validationError[2].field).toBe("password");
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
    expect(result.data!.signin.user).toBeNull();
    const validationError = result.data!.signin.errors;
    expect(validationError).toHaveLength(2);
    expect(validationError[0].field).toBe("email");
    expect(validationError[1].field).toBe("password");
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
    const validationError = result.data!.signin.errors;
    expect(validationError).toHaveLength(2);
    expect(validationError[0].field).toBe("email");
    expect(validationError[1].field).toBe("password");
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
    const validationError = result.data!.signin.errors;
    expect(validationError).toHaveLength(2);
    expect(validationError[0].field).toBe("email");
    expect(validationError[1].field).toBe("password");
  });
  it("should login user if email and password are correct credentials", async () => {
    const result = await signin();
    expect(result.data!.signin.user).not.toBeNull();
    expect(result.data!.signin.user.id).toBe("1");
    expect(result.data!.signin.user.email).toBe("test@test.com");
    expect(result.data!.signin.user.firstName).toBe("test");
    expect(result.data!.signin.user.lastName).toBe("tester");
  });
});
