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
const addAddressMutation = `mutation addAddress($args:AddAddressInput!){
  addAddress(args:$args){
    address{
      id
      latitude
      longitude
      country
      state
      city
      address_line_1
      address_line_2
      user{
        id
        firstName
        lastName
      }
    }
    errors{
      field
      message
    }
  }
}`;
const updateAddressMutation = `mutation updateAddress($args:updateAddressInput!){
  updateAddress(args:$args){
    address{
      id
      latitude
      longitude
      country
      state
      city
      address_line_1
      address_line_2
      user{
        id
        firstName
        lastName
      }
    }
    errors{
      field
      message
    }
  }
}`;
const getAllAddressesQuery = `query getAddresses{
  getAddresses{
    addresses{
      id
      longitude
      latitude
      state
      city
      country
      user{
        id
        firstName
        lastName
      }
    }
    errors{
      field
      message
    }


  }

}`;
const deleteAddressMutation = `mutation deleteAddress($addressId:Float!){
  deleteAddress(addressId:$addressId){
    addresses{
      id
      city
      state
      country
      address_line_1
      address_line_2
      user{
        id
        firstName
        lastName
      }
    }
    errors{
      field
      message
    }
  }
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
describe("addAddress", () => {
  it("should not add address to a user if user is not logged in", async () => {
    const result = await gCall({
      source: addAddressMutation,
      variableValues: {
        args: {
          latitude: "30.346",
          longitude: "-30.246",
          country: "lebanon",
          state: "koura",
          city: "kfar hazir",
          address_line_1: "test building",
          address_line_2: "5th floor",
        },
      },
    });
    expect(result.errors![0].message).toBe(
      "Access denied! You need to be authorized to perform this action!"
    );
  });
  it("should not add address to a user if arguements are invalid", async () => {
    const result = await gCall({
      source: addAddressMutation,
      variableValues: {
        args: {
          latitude: "-190",
          longitude: "-190",
          country: "test",
          state: "",
          city: "",
          address_line_1: "",
        },
      },
      userId: 1,
    });

    expect(result.data!.addAddress.errors).not.toBeNull();
  });
  it("should add address to a user", async () => {
    const result = await gCall({
      source: addAddressMutation,
      variableValues: {
        args: {
          latitude: "30.3324",
          longitude: "-30.3234",
          country: "Lebanon",
          city: "test city",
          address_line_1: "test address",
        },
      },
      userId: 1,
    });

    expect(result.data!.addAddress.address).not.toBeNull();
    await gCall({
      source: addAddressMutation,
      variableValues: {
        args: {
          latitude: "30.3324",
          longitude: "-30.3234",
          country: "Lebanon",
          city: "test city",
          address_line_1: "test address",
        },
      },
      userId: 1,
    });
  });
});
describe("updateAddress", () => {
  it("should not update address if user is not logged in", async () => {
    const result = await gCall({
      source: updateAddressMutation,
      variableValues: {
        args: {
          addressId: 1,
          latitude: "30.3324",
          longitude: "-30.3234",
          country: "Lebanon",
          city: "test city",
          address_line_1: "test address",
        },
      },
    });
    expect(result.errors![0].message).toBe(
      "Access denied! You need to be authorized to perform this action!"
    );
  });

  it("should not update address if arguements are invalid", async () => {
    const result = await gCall({
      source: updateAddressMutation,
      variableValues: {
        args: {
          addressId: 1,
          latitude: "-190",
          longitude: "-190",
          country: "test",
          city: "test city",
          address_line_1: "test address",
          state: "",
        },
      },
      userId: 1,
    });

    expect(result.data!.updateAddress.errors).not.toBeNull();
  });
  it("should update address", async () => {
    const result = await gCall({
      source: updateAddressMutation,
      variableValues: {
        args: {
          addressId: 1,
          latitude: "40.123",
          longitude: "40.5423",
          country: "Lebanon",
          city: "test city",
          address_line_1: "test address",
          state: "test",
        },
      },
      userId: 1,
    });

    expect(result.data!.updateAddress.errors).toBeNull();
    expect(result.data!.updateAddress.address).not.toBeNull();
  });
});
describe("getAddress", () => {
  it("should not get all addresses if user is not logged in", async () => {
    const result = await gCall({ source: getAllAddressesQuery });

    expect(result.errors![0].message).toBe(
      "Access denied! You need to be authorized to perform this action!"
    );
  });
  it("should get all addresses of logged in user", async () => {
    const result = await gCall({ source: getAllAddressesQuery, userId: 1 });

    expect(result.data!.getAddresses.addresses).not.toBeNull();
  });
});
describe("deleteAddress", () => {
  it("should not delete address if user is not logged in", async () => {
    const result = await gCall({
      source: deleteAddressMutation,
      variableValues: { addressId: 2 },
    });

    expect(result.errors![0].message).toBe(
      "Access denied! You need to be authorized to perform this action!"
    );
  });
  it("should not delete address if address does not belong to logged in user", async () => {
    const result = await gCall({
      source: deleteAddressMutation,
      variableValues: { addressId: 2 },
      userId: 2,
    });

    expect(result.data!.deleteAddress.errors[0].field).toBe("authorization");
  });
  it("should delete address of logged in user", async () => {
    const result = await gCall({
      source: deleteAddressMutation,
      variableValues: { addressId: 2 },
      userId: 1,
    });

    expect(result.data!.deleteAddress.addresses).toHaveLength(1);
  });
});
describe("logout", () => {
  it("should logout user if user is logged in", async () => {
    const result = await gCall({ source: logoutMutation, userId: 1 });
    expect(result.data!.logout).toBe(true);
  });
});
