import { gCall } from "../../test-utils/gCall";
import { createStore, signup } from "../../test-utils/sharedTest";

const addStoreSchema = `mutation addStore($args: AddStoreInput!){
  addStore(args:$args){
    store{
    id
    storeName
    storeDescription
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
const getStoreSchema = `query getStore($storeId:Float!){
  getStore(storeId:$storeId){
   store{
     id
     storeName
     storeDescription
     product{
       id
       name
       price
     }
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
const deleteStoreSchema = `mutation deleteStore($storeId:Float!){
  deleteStore(storeId:$storeId)
}`;
const addStoreAddressSchema = `mutation addStoreAddress($args:AddStoreAddressInput!){
addStoreAddress(args:$args){
  storeAddress{
    id
    latitude
    longitude
    city
    state
    address_line_1
    address_line_2
    country
  }
  errors{
    field
    message
  }
}
}`;
const updateStoreAddressSchema = `mutation updateStoreAddress($args:updateStoreAddressInput!){
updateStoreAddress(args:$args){
  storeAddress{
    id
    latitude
    longitude
    city
    state
    address_line_1
    address_line_2
    country
  }
  errors{
    field
    message
  }
}
}`;
beforeAll(async () => {
  await signup();
});

describe("store", () => {
  it("should add store if user is logged in", async () => {
    const result = await createStore();
    const resData = result.data!.addStore.store;
    expect(resData.storeName).toEqual("the testing store");
    expect(resData.storeDescription).toEqual(
      "store made by john doe and jane doe sells tests to everyone"
    );
    expect(resData.user.id).toEqual("1");
  });
  it("should not add store if user is unauthorized", async () => {
    const result = await gCall({
      source: addStoreSchema,
      variableValues: {
        args: {
          storeName: "the testing store",
          storeDescription:
            "store made by john doe and jane doe sells tests to everyone",
        },
      },
    });
    const authorizationResult = result.errors!;
    expect(authorizationResult[0].message).toEqual(
      "Access denied! You need to be authorized to perform this action!"
    );
  });
  it("should not add store if arguements are invalid!", async () => {
    const result = await gCall({
      source: addStoreSchema,
      variableValues: {
        args: {
          storeName: "",
          storeDescription: "",
        },
      },
      userId: 1,
    });
    expect(result.data!.addStore.errors).toHaveLength(2);
    expect(result.data!.addStore.errors[0].field).toEqual("storeName");
    expect(result.data!.addStore.errors[1].field).toEqual("storeDescription");
  });
});
describe("addingStoreAddress", () => {
  it("should not add a store address if user is not logged in", async () => {
    const result = await gCall({
      source: addStoreAddressSchema,
      variableValues: {
        args: {
          storeId: 1,
          latitude: "34.123",
          longitude: "35.234",
          country: "Lebanon",
          city: "koura",
          state: "North Lebanon",
          address_line_1: "test street",
          range: 10,
        },
      },
    });
    expect(result.errors![0].message).toBe(
      "Access denied! You need to be authorized to perform this action!"
    );
  });
  it("should not add a store address if user does not own store", async () => {
    const result = await gCall({
      source: addStoreAddressSchema,
      variableValues: {
        args: {
          storeId: 1,
          latitude: "34.123",
          longitude: "35.234",
          country: "Lebanon",
          city: "koura",
          state: "North Lebanon",
          address_line_1: "test street",
          range: 10,
        },
      },
      userId: 2,
    });
    expect(result.data!.addStoreAddress.errors[0].field).toBe("authorization");
  });
  it("should add a store address", async () => {
    const result = await gCall({
      source: addStoreAddressSchema,
      variableValues: {
        args: {
          storeId: 1,
          latitude: "34.123",
          longitude: "35.234",
          country: "Lebanon",
          city: "koura",
          state: "North Lebanon",
          address_line_1: "test street",
          range: 10,
        },
      },
      userId: 1,
    });
    console.log(result);

    expect(result.data!.addStoreAddress.storeAddress).not.toBeNull();
  });
});
describe("updatingStoreAddress", () => {
  it("should not update a store address if user is not logged in", async () => {
    const result = await gCall({
      source: updateStoreAddressSchema,
      variableValues: {
        args: {
          storeId: 1,
          latitude: "34.123",
          longitude: "35.234",
          country: "Lebanon",
          city: "koura",
          state: "North Lebanon",
          address_line_1: "test street",
          range: 10,
        },
      },
    });

    expect(result.errors![0].message).toBe(
      "Access denied! You need to be authorized to perform this action!"
    );
    // expect(result.data!.addStoreAddress.storeAddress).not.toBeNull();
  });
  it("should not update a store address if user does not own store", async () => {
    const result = await gCall({
      source: updateStoreAddressSchema,
      variableValues: {
        args: {
          storeId: 1,
          latitude: "34.123",
          longitude: "35.234",
          country: "Lebanon",
          city: "koura",
          state: "North Lebanon",
          address_line_1: "test street",
          range: 10,
        },
      },
      userId: 2,
    });
    expect(result.data!.updateStoreAddress.errors[0].field).toBe(
      "authorization"
    );
  });
  it("should update a store address", async () => {
    const result = await gCall({
      source: updateStoreAddressSchema,
      variableValues: {
        args: {
          storeId: 1,
          latitude: "32.12345",
          longitude: "37.7652",
          country: "Lebanon",
          city: "koura",
          state: "North Lebanon",
          address_line_1: "test street",
          range: 10,
        },
      },
      userId: 1,
    });
    console.log(result);

    expect(result.data!.updateStoreAddress.storeAddress.latitude).toBe(
      "32.12345"
    );
    expect(result.data!.updateStoreAddress.storeAddress.longitude).toBe(
      "37.7652"
    );
  });
});
describe("fetching store", () => {
  it("should get single store by id", async () => {
    const result = await gCall({
      source: getStoreSchema,
      variableValues: { storeId: 1 },
      userId: 1,
    });
    expect(result.data!.getStore.store).not.toBeNull();
  });
});

describe("delete store", () => {
  it("should not delete store if the user is not authorized", async () => {
    const result = await gCall({
      source: deleteStoreSchema,
      variableValues: { storeId: 1 },
    });

    expect(result.errors![0].message).toEqual(
      "Access denied! You need to be authorized to perform this action!"
    );
  });
  it("should not delete store if the user does not own the store", async () => {
    const result = await gCall({
      source: deleteStoreSchema,
      variableValues: { storeId: 1 },
      userId: 2,
    });

    expect(result.data!.deleteStore).toEqual(false);
  });
  it("should delete store if the user owns the store", async () => {
    const result = await gCall({
      source: deleteStoreSchema,
      variableValues: { storeId: 1 },
      userId: 1,
    });

    expect(result.data!.deleteStore).toEqual(true);
  });
});
