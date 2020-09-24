import { gCall } from "../../test-utils/gCall";
import { signin, signup } from "../../test-utils/sharedTest";

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
const currentUser = `query currentUser{
  currentUser{
    id
    firstName
    lastName
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
const logoutMutation = `mutation logout{
  logout
}`;

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
describe("currentUser", () => {
  it("should return current user if user is logged in", async () => {
    const result = await gCall({ source: currentUser, userId: 1 });
    expect(result.data!.currentUser.id).toBe("1");
  });
  it("should not return current user if user is not logged in", async () => {
    const result = await gCall({ source: currentUser });
    expect(result.errors![0].message).toBe(
      "Access denied! You need to be authorized to perform this action!"
    );
  });
});
describe("logout", () => {
  it("should logout user if user is logged in", async () => {
    const result = await gCall({ source: logoutMutation, userId: 1 });
    expect(result.data!.logout).toBe(true);
  });
});
