import { Store } from "../../Entity/Store";
import { getRepository } from "typeorm";
// import { testConn } from "../../test-utils/testconn";
import { gCall } from "../../test-utils/gCall";
import { createStore, signup } from "../../test-utils/sharedTest";
// import { UnauthorizedError } from "type-graphql";
// import { Connection } from "typeorm";

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
const removeStores = async () => {
  const store = getRepository(Store);
  const allStores = store.find();
  (await allStores).forEach(async (s) => {
    await store.remove(s);
  });
};
beforeAll(async () => {
  await signup();
});

afterAll(async () => {
  await removeStores();
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
    console.log(result.errors![0].message);

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
