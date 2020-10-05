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
const getNearbyStoresSchema = `query getNearbyStores($args:getNearbyStoresInput!){
  getNearbyStores(args:$args){
    stores{
        id
        storeName
        storeDescription
        type
        category
        address{
          longitude
          latitude
          city
          state
          country
      }
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
          type: "Supermarket",
          category: ["Electronics", "Convenience Goods"],
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
          type: "Super",
          category: ["Electr", "Convenience"],
        },
      },
      userId: 1,
    });
    expect(result.data!.addStore.errors).toHaveLength(5);
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
          latitude: 34.123,
          longitude: 35.234,
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
          latitude: 34.123,
          longitude: 35.234,
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
          latitude: 35.7813759,
          longitude: 34.3135001,
          country: "Lebanon",
          city: "koura",
          state: "North Lebanon",
          address_line_1: "test street",
          range: 10,
        },
      },
      userId: 1,
    });

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
          latitude: 34.123,
          longitude: 35.234,
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
          latitude: 34.123,
          longitude: 35.234,
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
          latitude: 35.7752915,
          longitude: 34.3134698,
          country: "Lebanon",
          city: "koura",
          state: "North Lebanon",
          address_line_1: "test street",
          range: 2,
        },
      },
      userId: 1,
    });

    expect(result.data!.updateStoreAddress.storeAddress.latitude).toBe(
      35.7752915
    );
    expect(result.data!.updateStoreAddress.storeAddress.longitude).toBe(
      34.3134698
    );
  });
});
describe("fetching nearby stores", () => {
  it("should fetch nearby stores", async () => {
    const result = await gCall({
      source: getNearbyStoresSchema,
      variableValues: {
        args: {
          longitude: 34.313357,
          latitude: 35.7877967,
          country: "Lebanon",
        },
      },
    });
    expect(result.data!.getNearbyStores.stores).not.toBeNull();
  });
  it("should fetch nearby stores with type filter", async () => {
    const result = await gCall({
      source: getNearbyStoresSchema,
      variableValues: {
        args: {
          longitude: 34.313357,
          latitude: 35.7877967,
          country: "Lebanon",
          type: "Supermarket",
        },
      },
    });

    expect(result.data!.getNearbyStores.stores).not.toBeNull();
  });
  it("should fetch nearby stores with category filter", async () => {
    const result = await gCall({
      source: getNearbyStoresSchema,
      variableValues: {
        args: {
          longitude: 34.313357,
          latitude: 35.7877967,
          country: "Lebanon",
          category: "Convenience Goods",
        },
      },
    });

    expect(result.data!.getNearbyStores.stores).not.toBeNull();
  });
  it("should fetch nearby stores with both type and category filter", async () => {
    const result = await gCall({
      source: getNearbyStoresSchema,
      variableValues: {
        args: {
          longitude: 34.313357,
          latitude: 35.7877967,
          country: "Lebanon",
          type: "Supermarket",
          category: "Convenience Goods",
        },
      },
    });

    expect(result.data!.getNearbyStores.stores).not.toBeNull();
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
